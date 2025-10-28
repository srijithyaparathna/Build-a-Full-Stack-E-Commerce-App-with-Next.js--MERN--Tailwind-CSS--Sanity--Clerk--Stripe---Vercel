"use server";  
// Marks this file as a Next.js Server Action — it runs on the server only (not client-side).

import stripe from "@/lib/stripe";  
// Imports the initialized Stripe instance configured with your secret API key.

import { Address } from "@/sanity.types";  
// Imports the Address type (used for delivery/shipping details).

import { urlFor } from "@/sanity/lib/image";  
// Helper function to generate URLs for product images stored in Sanity CMS.

import { CartItem } from "@/store";  
// Imports CartItem type from the global store to represent cart products.

import Stripe from "stripe";  
// Imports Stripe types for proper TypeScript support.


/* ---------- INTERFACES ---------- */

// Metadata holds order and customer details that will be passed to Stripe.
export interface Metadata {
  orderNumber: string;             // Unique order ID generated for the transaction.
  customerName: string;            // Customer's full name.
  customerEmail: string;           // Customer's email address.
  clerkUserId?: string;            // Optional ID from Clerk authentication.
  address?: Address | null;        // Optional delivery/shipping address.
}

// Represents grouped cart items (product + quantity).
export interface GroupedCartItems {
  product: CartItem["product"];    // Product data (name, price, description, etc.).
  quantity: number;                // Number of units ordered.
}


/* ---------- MAIN FUNCTION ---------- */

export async function createCheckoutSession(
  items: GroupedCartItems[],        // All products grouped by type.
  metadata: Metadata                // Order metadata with customer details.
) {
  try {
    // 🧾 Step 1: Check if the customer already exists in Stripe.
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,  // Search for an existing customer by email.
      limit: 1,                       // Only return one matching record.
    });

    // If a customer exists, get their ID. Otherwise, leave it empty.
    const customerId = customers?.data?.length > 0 ? customers.data[0].id : "";

    // 🧱 Step 2: Prepare the checkout session payload for Stripe.
    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      metadata: {
        // Attach order details so you can access them later in Stripe dashboard.
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        clerkUserId: metadata.clerkUserId!,       // Clerk user ID for internal tracking.
        address: JSON.stringify(metadata.address), // Convert address object to string.
      },
      mode: "payment",                // Stripe mode: one-time payment.
      allow_promotion_codes: true,    // Allow discount/promo codes at checkout.
      payment_method_types: ["card"], // Accepted payment method.
      invoice_creation: {
        enabled: true,                // Generate an invoice automatically after payment.
      },
      success_url: `${               // Redirect URL after successful payment.
        process.env.NEXT_PUBLIC_BASE_URL
      }/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`, // Redirect if payment canceled.

      // 🛒 Line items — each product in the cart.
      line_items: items?.map((item) => ({
        price_data: {
          currency: "USD",                                      // Transaction currency.
          unit_amount: Math.round(item?.product?.price! * 100),  // Stripe expects price in cents.
          product_data: {
            name: item?.product?.name || "Unknown Product",      // Product name.
            description: item?.product?.description,             // Optional description.
            metadata: { id: item?.product?._id },                // Store product ID.
            images:                                             // Display image on Stripe checkout.
              item?.product?.images && item?.product?.images?.length > 0
                ? [urlFor(item?.product?.images[0]).url()]       // Convert Sanity image to URL.
                : undefined,
          },
        },
        quantity: item?.quantity,  // Number of units purchased.
      })),
    };

    // 🧍 Step 3: Attach customer details to the session.
    if (customerId) {
      // If customer exists in Stripe, link them by ID.
      sessionPayload.customer = customerId;
    } else {
      // Otherwise, just use their email (Stripe will create a new record automatically).
      sessionPayload.customer_email = metadata.customerEmail;
    }

    // 💳 Step 4: Create the Stripe Checkout Session.
    const session = await stripe.checkout.sessions.create(sessionPayload);

    // Return the session URL so frontend can redirect user to Stripe Checkout.
    return session.url;

  } catch (error) {
    // 🚨 Handle and log any errors.
    console.error("Error creating Checkout Session", error);
    throw error; // Re-throw to be caught by frontend or logging system.
  }
}
