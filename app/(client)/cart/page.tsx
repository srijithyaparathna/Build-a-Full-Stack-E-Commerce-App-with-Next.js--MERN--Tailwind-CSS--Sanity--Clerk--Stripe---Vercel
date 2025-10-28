"use client"; 
// This marks the component as a client-side component in Next.js (needed for hooks, state, etc.)

import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession"; 
// Import the server-side function that creates a Stripe checkout session

// Import reusable UI components and utilities
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";

import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";
import ProductSideMenu from "@/components/ProductSideMenu";
import QuantityButtons from "@/components/QuantityButtons";
import { Title } from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Address } from "@/sanity.types"; // Address type from Sanity schema
import { client } from "@/sanity/lib/client"; // Sanity client to fetch data
import { urlFor } from "@/sanity/lib/image"; // Helper to generate image URLs
import useStore from "@/store"; // Zustand global state store for cart
import { useAuth, useUser } from "@clerk/nextjs"; // Clerk authentication hooks
import { ShoppingBag, Trash } from "lucide-react"; // Icons
import Image from "next/image"; // Optimized image component
import Link from "next/link"; // Next.js routing
import { useEffect, useState } from "react"; // React hooks
import toast from "react-hot-toast"; // For showing notifications

// ===============================
// 🔹 CART PAGE COMPONENT
// ===============================
const CartPage = () => {
  // Destructure functions from Zustand store
  const {
    deleteCartProduct, // removes an item from cart
    getTotalPrice,     // calculates total (after discount)
    getItemCount,      // returns how many of an item are in cart
    getSubTotalPrice,  // calculates subtotal (before discount)
    resetCart,         // clears the cart completely
  } = useStore();

  const [loading, setLoading] = useState(false); // Loading state (used during checkout)
  const groupedItems = useStore((state) => state.getGroupedItems()); // Group similar products
  const { isSignedIn } = useAuth(); // Check if user is logged in
  const { user } = useUser(); // Get logged-in user's data
  const [addresses, setAddresses] = useState<Address[] | null>(null); // Stores all user addresses
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null); // Stores chosen delivery address

  // ===============================
  // 🔹 FETCH ADDRESSES FROM SANITY
  // ===============================
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const query = `*[_type=="address"] | order(publishedAt desc)`; // GROQ query to get address list
      const data = await client.fetch(query); // Fetch address data from Sanity
      setAddresses(data);
      
      // Set default address if available, else use the first one
      const defaultAddress = data.find((addr: Address) => addr.default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]);
      }
    } catch (error) {
      console.log("Addresses fetching error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch addresses when component mounts
  useEffect(() => {
    fetchAddresses();
  }, []);

  // ===============================
  // 🔹 RESET CART HANDLER
  // ===============================
  const handleResetCart = () => {
    const confirmed = window.confirm("Are you sure you want to reset your cart?");
    if (confirmed) {
      resetCart(); // Clear all items in cart (Zustand action)
      toast.success("Cart reset successfully!");
    }
  };

  // ===============================
  // 🔹 CHECKOUT HANDLER (Stripe)
  // ===============================
  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Prepare checkout metadata (used by Stripe and backend)
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(), // Generate unique order number
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        clerkUserId: user?.id,
        address: selectedAddress,
      };

      // Create Stripe checkout session using server-side action
      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);

      // Redirect user to Stripe payment page
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 🔹 PAGE RENDERING
  // ===============================
  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isSignedIn ? ( // If user is logged in
        <Container>
          {groupedItems?.length ? ( // If cart has items
            <>
              {/* CART HEADER */}
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag className="text-darkColor" />
                <Title>Shopping Cart</Title>
              </div>

              {/* GRID LAYOUT: Left (Items) | Right (Summary) */}
              <div className="grid lg:grid-cols-3 md:gap-8">
                
                {/* LEFT SECTION: CART ITEMS */}
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md">
                    {groupedItems?.map(({ product }) => {
                      const itemCount = getItemCount(product?._id); // Get quantity per item
                      return (
                        <div
                          key={product?._id}
                          className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
                        >
                          {/* PRODUCT IMAGE & DETAILS */}
                          <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                            {product?.images && (
                              <Link
                                href={`/product/${product?.slug?.current}`}
                                className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group"
                              >
                                {/* Product image */}
                                <Image
                                  src={urlFor(product?.images[0]).url()}
                                  alt="productImage"
                                  width={500}
                                  height={500}
                                  loading="lazy"
                                  className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                                />
                              </Link>
                            )}

                            {/* PRODUCT INFO */}
                            <div className="h-full flex flex-1 flex-col justify-between py-1">
                              <div className="flex flex-col gap-0.5 md:gap-1.5">
                                <h2 className="text-base font-semibold line-clamp-1">
                                  {product?.name}
                                </h2>
                                <p className="text-sm capitalize">
                                  Variant: <span className="font-semibold">{product?.variant}</span>
                                </p>
                                <p className="text-sm capitalize">
                                  Status: <span className="font-semibold">{product?.status}</span>
                                </p>
                              </div>

                              {/* ACTION BUTTONS (favorite/delete) */}
                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <ProductSideMenu product={product} />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold">
                                      Add to Favorite
                                    </TooltipContent>
                                  </Tooltip>

                                  {/* Delete item */}
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Trash
                                        onClick={() => {
                                          deleteCartProduct(product?._id);
                                          toast.success("Product deleted successfully!");
                                        }}
                                        className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold bg-red-600">
                                      Delete product
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>

                          {/* PRICE & QUANTITY */}
                          <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
                            <PriceFormatter
                              amount={(product?.price as number) * itemCount}
                              className="font-bold text-lg"
                            />
                            <QuantityButtons product={product} />
                          </div>
                        </div>
                      );
                    })}

                    {/* RESET CART BUTTON */}
                    <Button
                      onClick={handleResetCart}
                      className="m-5 font-semibold"
                      variant="destructive"
                    >
                      Reset Cart
                    </Button>
                  </div>
                </div>

                {/* RIGHT SECTION: ORDER SUMMARY & ADDRESS */}
                <div>
                  <div className="lg:col-span-1">
                    
                    {/* ORDER SUMMARY (Desktop View) */}
                    <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>SubTotal</span>
                          <PriceFormatter amount={getSubTotalPrice()} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Discount</span>
                          <PriceFormatter
                            amount={getSubTotalPrice() - getTotalPrice()}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold text-lg">
                          <span>Total</span>
                          <PriceFormatter
                            amount={getTotalPrice()}
                            className="text-lg font-bold text-black"
                          />
                        </div>
                        <Button
                          className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                          size="lg"
                          disabled={loading}
                          onClick={handleCheckout}
                        >
                          {loading ? "Please wait..." : "Proceed to Checkout"}
                        </Button>
                      </div>
                    </div>

                    {/* DELIVERY ADDRESS SECTION */}
                    {addresses && (
                      <div className="bg-white rounded-md mt-5">
                        <Card>
                          <CardHeader>
                            <CardTitle>Delivery Address</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup
                              defaultValue={addresses
                                ?.find((addr) => addr.default)?._id.toString()}
                            >
                              {addresses?.map((address) => (
                                <div
                                  key={address?._id}
                                  onClick={() => setSelectedAddress(address)}
                                  className={`flex items-center space-x-2 mb-4 cursor-pointer ${
                                    selectedAddress?._id === address?._id && "text-shop_dark_green"
                                  }`}
                                >
                                  <RadioGroupItem value={address?._id.toString()} />
                                  <Label htmlFor={`address-${address?._id}`} className="grid gap-1.5 flex-1">
                                    <span className="font-semibold">{address?.name}</span>
                                    <span className="text-sm text-black/60">
                                      {address.address}, {address.city}, {address.state} {address.zip}
                                    </span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                            <Button variant="outline" className="w-full mt-4">
                              Add New Address
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>

                {/* MOBILE VIEW ORDER SUMMARY */}
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
                  <div className="bg-white p-4 rounded-lg border mx-4">
                    <h2>Order Summary</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>SubTotal</span>
                        <PriceFormatter amount={getSubTotalPrice()} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Discount</span>
                        <PriceFormatter
                          amount={getSubTotalPrice() - getTotalPrice()}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between font-semibold text-lg">
                        <span>Total</span>
                        <PriceFormatter
                          amount={getTotalPrice()}
                          className="text-lg font-bold text-black"
                        />
                      </div>
                      <Button
                        className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                        size="lg"
                        disabled={loading}
                        onClick={handleCheckout}
                      >
                        {loading ? "Please wait..." : "Proceed to Checkout"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyCart /> // If no items, show empty cart component
          )}
        </Container>
      ) : (
        <NoAccess /> // If user not signed in, show no-access page
      )}
    </div>
  );
};

export default CartPage;
