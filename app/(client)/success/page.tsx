// Enable client-side rendering in Next.js (important because we use hooks like useEffect)
"use client";

import useStore from "@/store"; // Custom global store (likely Zustand) to manage cart state
import { useSearchParams } from "next/navigation"; // Hook to access URL query parameters in Next.js
import { Suspense, useEffect } from "react"; // React features for async rendering and side effects
import { motion } from "framer-motion"; // Framer Motion for animations
import { Check, Home, Package, ShoppingBag } from "lucide-react"; // Icon components from Lucide
import Link from "next/link"; // Next.js link component for navigation

// Component that contains the main success page UI
const SuccessPageContent = () => {
  const { resetCart } = useStore(); // Get the resetCart function from the global store
  const searchParams = useSearchParams(); // Access URL parameters (e.g., ?orderNumber=1234)
  const orderNumber = searchParams.get("orderNumber"); // Extract the "orderNumber" query parameter

  // Side effect: when the orderNumber is present, reset the cart
  useEffect(() => {
    if (orderNumber) {
      resetCart(); // Clear all items from the cart after successful order
    }
  }, [orderNumber, resetCart]); // Dependencies ensure this runs when orderNumber changes

  return (
    <div className="py-5 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mx-4">
      {/* Animated container for the success card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} // Start slightly faded and moved down
        animate={{ opacity: 1, y: 0 }} // Animate to visible and in-place
        transition={{ duration: 0.5 }} // Animation duration
        className="bg-white rounded-2xl flex flex-col gap-8 shadow-2xl p-6 max-w-xl w-full text-center"
      >
        {/* Animated success check icon */}
        <motion.div
          initial={{ scale: 0 }} // Start invisible (shrunk)
          animate={{ scale: 1 }} // Animate to full size
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }} // Spring animation with bounce
          className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          {/* White check mark inside black circle */}
          <Check className="text-white w-10 h-10" />
        </motion.div>

        {/* Main heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Confirmed!
        </h1>

        {/* Order details and message */}
        <div className="space-y-4 mb-4 text-left">
          <p className="text-gray-700">
            Thank you for your purchase. We&apos;re processing your order and
            will ship it soon. A confirmation email with your order details will
            be sent to your inbox shortly.
          </p>

          {/* Display the order number from the URL */}
          <p className="text-gray-700">
            Order Number:{" "}
            <span className="text-black font-semibold">{orderNumber}</span>
          </p>
        </div>

        {/* Buttons for navigation: Home, Orders, and Shop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Link to home page */}
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-2" /> {/* Home icon */}
            Home
          </Link>

          {/* Link to orders page */}
          <Link
            href="/orders"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-lightGreen text-black border border-lightGreen rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md"
          >
            <Package className="w-5 h-5 mr-2" /> {/* Package icon */}
            Orders
          </Link>

          {/* Link back to shop */}
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <ShoppingBag className="w-5 h-5 mr-2" /> {/* Shopping bag icon */}
            Shop
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

// Wrapper component that uses React Suspense
// This allows `useSearchParams()` to work properly (it’s a server-side async feature)
const SuccessPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
};

// Export the main page component
export default SuccessPage;
