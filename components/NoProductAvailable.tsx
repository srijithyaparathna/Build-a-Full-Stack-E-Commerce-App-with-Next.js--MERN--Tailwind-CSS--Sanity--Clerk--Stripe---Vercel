"use client"
// this tells Next.js that this component runs on the client silde


// cn is the helper function for conditionally joinig class names
import { cn } from '@/lib/utils';
import { motion } from "framer-motion";

// ✅ Importing `motion` from Framer Motion (for animations on React elements).

import { Loader2 } from 'lucide-react';

import React from 'react'


const NoProductAvailable = ({
  selectedTab,  // ✅ The currently selected tab/category (e.g., "Popular", "New", etc.)
  className,    // ✅ Optional custom CSS classes passed from parent component
}: {
  selectedTab?: string;  // ✅ Optional prop — name of the selected tab (string)
  className?: string;    // ✅ Optional prop — additional CSS classes
})  => {
  return (
    // Outer container that centers and styles the entire No Product message

    <div 
      className={cn(
        "flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10 "
       // allows external custom classes to be merged with default 
      )}
    >
      {/* 🟩 Animated heading section */}
      <motion.div
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{duration:0.5}}
       className="text-gray-600"
      >
 <h2 className="text-2xl font-bold text-gray-800">
          No Product Available
        </h2>


      </motion.div>
       {/* 🟩 Subtext with selected tab name */}
      <motion.p
        // Fade in animation for the paragraph
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        // Slight delay after the heading
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-gray-600"
      >
        {/* Message with highlighted selected category */}
        We&apos;re sorry, but there are no products matching on{" "}
        <span className="text-base font-semibold text-darkColor">
          {selectedTab}
        </span>{" "}
        criteria at the moment.
      </motion.p>
      
      {/* 🟩 Animated loader section */}
      <motion.div
        // Adds a subtle pulsing animation to indicate activity/restocking
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="flex items-center space-x-2 text-shop_dark_green"
      >
        {/* Spinning loader icon */}
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>We&apos;re restocking shortly</span>
      </motion.div>

      {/* 🟩 Final message (fade in with slight delay) */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-sm text-gray-500"
      >
        Please check back later or explore our other product categories.
      </motion.p>
      
     </div>
  )
}

export default NoProductAvailable