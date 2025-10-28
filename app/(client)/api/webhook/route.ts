// Import types and utilities
import { Metadata } from "@/actions/createCheckoutSession";  // Custom metadata type for checkout sessions
import stripe from "@/lib/stripe";  // Stripe instance configured with your secret key
import { backendClient } from "@/sanity/lib/backendClient";  // Sanity client for managing CMS data (like orders)
import { headers } from "next/headers";  // Utility to read HTTP headers in Next.js
import { NextRequest, NextResponse } from "next/server";  // Next.js request/response types
import Stripe from "stripe";  // Stripe library for types and API interactions

// Handles incoming POST requests from Stripe Webhooks
export async function POST(req: NextRequest) {
  const body = await req.text();  // Read the raw body (required for Stripe signature verification)
  const headersList = await headers();  // Get all headers from the request
  const sig = headersList.get("stripe-signature");  // Extract the Stripe signature header

  // If the signature is missing, return an error response
  if (!sig) {
    return NextResponse.json(
      { error: "No Signature found for stripe" },
      { status: 400 }
    );
  }

  // Retrieve the Stripe Webhook secret from environment variables
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.log("Stripe webhook secret is not set");
    return NextResponse.json(
      { error: "Stripe webhook secret is not set" },
      { status: 400 }
    );
  }

  let event: Stripe.Event; // Variable to store the verified event

  try {
    // Verify the event's authenticity using Stripe’s library
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    // If signature verification fails, log and return an error
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: `Webhook Error: ${error}` },
      { status: 400 }
    );
  }

  // Handle only the successful checkout session completion event
  if (event.type === "checkout.session.completed") {
    // Extract session data from the event
    const session = event.data.object as Stripe.Checkout.Session;

    // Retrieve the invoice if available
    const invoice = session.invoice
      ? await stripe.invoices.retrieve(session.invoice as string)
      : null;

    try {
      // Create a corresponding order in Sanity CMS
      await createOrderInSanity(session, invoice);
    } catch (error) {
      // Handle any errors during order creation
      console.error("Error creating order in sanity:", error);
      return NextResponse.json(
        { error: `Error creating order: ${error}` },
        { status: 400 }
      );
    }
  }

  // Respond with success so Stripe knows the webhook was received
  return NextResponse.json({ received: true });
}

// Function that creates an order record in Sanity when payment succeeds
async function createOrderInSanity(
  session: Stripe.Checkout.Session,
  invoice: Stripe.Invoice | null
) {
  // Destructure relevant session fields
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    total_details,
  } = session;

  // Extract metadata passed during checkout (like user and order info)
  const { orderNumber, customerName, customerEmail, clerkUserId, address } =
    metadata as unknown as Metadata & { address: string };

  // Parse the shipping/billing address JSON if available
  const parsedAddress = address ? JSON.parse(address) : null;

  // Fetch all line items (products) from the checkout session
  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    { expand: ["data.price.product"] } // Expands to include full product info
  );

  // Prepare arrays for order creation and stock updates
  const sanityProducts = []; // To store order product references for Sanity
  const stockUpdates = []; // To store stock deduction info

  // Loop through each purchased item
  for (const item of lineItemsWithProduct.data) {
    // Get product ID from the Stripe product metadata
    const productId = (item.price?.product as Stripe.Product)?.metadata?.id;
    const quantity = item?.quantity || 0;

    // Skip if product ID is missing
    if (!productId) continue;

    // Create Sanity reference entry for each product
    sanityProducts.push({
      _key: crypto.randomUUID(), // Unique key for array entries in Sanity
      product: {
        _type: "reference",
        _ref: productId, // Reference to product document in Sanity
      },
      quantity,
    });

    // Add to stock update list
    stockUpdates.push({ productId, quantity });
  }

  // Create a new order document in Sanity CMS
  const order = await backendClient.create({
    _type: "order", // Sanity schema type
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName,
    stripeCustomerId: customerEmail,
    clerkUserId: clerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0, // Convert cents to base currency

    products: sanityProducts, // Attach products list
    totalPrice: amount_total ? amount_total / 100 : 0, // Convert cents to dollars/rupees
    status: "paid", // Mark as paid
    orderDate: new Date().toISOString(), // Record current timestamp

    // If invoice exists, store basic details
    invoice: invoice
      ? {
          id: invoice.id,
          number: invoice.number,
          hosted_invoice_url: invoice.hosted_invoice_url,
        }
      : null,

    // Store the customer's address (if provided)
    address: parsedAddress
      ? {
          state: parsedAddress.state,
          zip: parsedAddress.zip,
          city: parsedAddress.city,
          address: parsedAddress.address,
          name: parsedAddress.name,
        }
      : null,
  });

  // After creating the order, update product stock levels in Sanity
  await updateStockLevels(stockUpdates);

  // Return the created order
  return order;
}

// Function to decrease stock for purchased products
async function updateStockLevels(
  stockUpdates: { productId: string; quantity: number }[]
) {
  // Iterate over each product that needs a stock update
  for (const { productId, quantity } of stockUpdates) {
    try {
      // Fetch the product document from Sanity by its ID
      const product = await backendClient.getDocument(productId);

      // If product doesn’t exist or has invalid stock, skip it
      if (!product || typeof product.stock !== "number") {
        console.warn(
          `Product with ID ${productId} not found or stock is invalid.`
        );
        continue;
      }

      // Deduct purchased quantity, ensuring stock doesn’t go below zero
      const newStock = Math.max(product.stock - quantity, 0);

      // Commit stock update to Sanity
      await backendClient.patch(productId).set({ stock: newStock }).commit();
    } catch (error) {
      // Log any errors encountered during update
      console.error(`Failed to update stock for product ${productId}:`, error);
    }
  }
}
