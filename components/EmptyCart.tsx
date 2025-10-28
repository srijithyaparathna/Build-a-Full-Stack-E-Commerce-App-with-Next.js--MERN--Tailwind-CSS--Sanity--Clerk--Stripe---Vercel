"use client"; 
// This tells Next.js that this file is a client-side component (it can use hooks, animations, etc.)

import { ShoppingCart } from "lucide-react"; 
// Importing a shopping cart icon from the lucide-react icon library

import Link from "next/link"; 
// Used for client-side navigation between pages in a Next.js app

import { motion } from "framer-motion"; 
// Importing Framer Motion for smooth animations

import { emptyCart } from "@/images"; 
// Importing an image named 'emptyCart' from the images folder (probably an illustration)

import Image from "next/image"; 
// Optimized image component provided by Next.js


// === EmptyCart Component ===
export default function EmptyCart() {
  return (
    // Outer container with padding, gradient background, and centered content
    <div className="py-10 md:py-20 bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">

      {/* Animated card using Framer Motion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} // Start slightly faded and lower
        animate={{ opacity: 1, y: 0 }} // Animate to full opacity and move up
        transition={{ duration: 0.5 }} // Smooth animation duration
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full space-y-8" // Styling for card look
      >

        {/* Animated image container for the empty cart */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1], // Slight zoom in and out
            rotate: [0, 5, -5, 0], // Gentle rotation for a floating effect
          }}
          transition={{
            repeat: Infinity, // Repeat animation forever
            duration: 5, // Animation duration
            ease: "easeInOut", // Smooth motion curve
          }}
          className="relative w-48 h-48 mx-auto" // Set size and center horizontally
        >

          {/* Empty cart illustration */}
          <Image
            src={emptyCart} // The imported empty cart image
            alt="Empty shopping cart" // Alt text for accessibility
            layout="fill" // Make image fill the parent container
            objectFit="contain" // Keep aspect ratio inside container
            className="drop-shadow-lg" // Add shadow under the image
          />

          {/* Animated floating shopping cart icon (on top of the image) */}
          <motion.div
            animate={{
              x: [0, -10, 10, 0], // Move left and right
              y: [0, -5, 5, 0], // Move up and down slightly
            }}
            transition={{
              repeat: Infinity, // Loop animation forever
              duration: 3, // Duration of one cycle
              ease: "linear", // Linear (constant speed)
            }}
            className="absolute -top-4 -right-4 bg-blue-500 rounded-full p-2" // Position and style the icon container
          >
            <ShoppingCart size={24} className="text-white" /> 
            {/* White shopping cart icon inside blue circle */}
          </motion.div>
        </motion.div>

        {/* Text content below the image */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Your cart is feeling lonely
          </h2>
          <p className="text-gray-600">
            It looks like you haven&apos;t added anything to your cart yet.
            Let&apos;s change that and find some amazing products for you!
          </p>
        </div>

        {/* Button that links to home page to browse products */}
        <div>
          <Link
            href="/"
            className="block bg-darkColor/5 border border-darkColor/20 text-center py-2.5 rounded-full text-sm font-semibold tracking-wide hover:border-darkColor hover:bg-darkColor hover:text-white hoverEffect"
          >
            Discover Products
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
