// Mark this file as a Client Component so it runs in the browser (enables hooks & client-only code)
"use client";

// Import the Product type from your shared types file (used for typing the `product` prop)
import { Product } from "@/sanity.types";

// Import the Zustand (or custom) store hook that manages favorites and related actions
import useStore from "@/store";

// Import the Heart icon component from lucide-react for the favorite icon UI
import { Heart } from "lucide-react";

// Next.js Link component for client-side navigation to the wishlist page
import Link from "next/link";

// React itself and specific hooks used in this component
import React, { useEffect, useState } from "react";

// Toast utility for showing success messages on add/remove favorite
import toast from "react-hot-toast";

// Component definition: FavoriteButton accepts props to control display and the product to favorite
const FavoriteButton = ({
  // showProduct toggles between a simple link badge vs an interactive button on product pages
  showProduct = false,
  // product is the Product object (or null/undefined) that this button will add/remove from favorites
  product,
}: {
  // Type definitions for props:
  showProduct?: boolean; // optional boolean
  product?: Product | null | undefined; // optional Product (or null/undefined)
}) => {
  // Destructure actions/state from your store: favoriteProduct (array) and addToFavorite (action)
  const { favoriteProduct, addToFavorite } = useStore();

  // Local state to track whether the current product already exists in favorites
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);

  // Effect runs when either the `product` prop or the `favoriteProduct` store array changes
  useEffect(() => {
    // Find if the current product exists in the favorites array (compare by _id)
    const availableItem = favoriteProduct.find(
      (item) => item?._id === product?._id
    );
    // If found, store it in local state; otherwise store null
    setExistingProduct(availableItem || null);
    // The dependency array ensures this effect re-runs whenever product or favorites change
  }, [product, favoriteProduct]);

  // Event handler for when the favorite button is clicked (only used in showProduct === true mode)
  const handleFavorite = (e: React.MouseEvent<HTMLSpanElement>) => {
    // Prevent default link/button behavior (important if inside a clickable parent Link)
    e.preventDefault();

    // If product has an _id (guards against undefined product), call addToFavorite
    if (product?._id) {
      // addToFavorite is expected to return a Promise (so we can show a toast after completion)
      addToFavorite(product).then(() => {
        // Show success toast — message depends on whether the product was already in favorites
        toast.success(
          existingProduct
            ? "Product removed successfully!"
            : "Product added successfully!"
        );
      });
    }
  };

  // JSX returned by the component
  return (
    <>
      {/* If showProduct is false, render a Link to the wishlist page with a badge count */}
      {!showProduct ? (
        <Link href={"/wishlist"} className="group relative">
          {/* Heart icon (unfilled) shown on the wishlist shortcut */}
          <Heart className="w-5 h-5 hover:text-shop-light-green hoverEffect" />

          {/* Badge showing the number of favorited items; falls back to 0 if undefined */}
          <span className="absolute -top-1 -right-1 bg-shop-dark-green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
            {favoriteProduct?.length ? favoriteProduct?.length : 0}
          </span>
        </Link>
      ) : (
        // If showProduct is true, render an interactive button that toggles favorite for this product
        <button
          onClick={handleFavorite} // Attach the click handler defined above
          className="group relative hover:text-shop-light-green hoverEffect border border-shop-light-green/80 hover:border-shop-light-green p-1.5 rounded-sm"
        >
          {/* Conditionally render the Heart icon filled or not based on existingProduct */}
          {existingProduct ? (
            // If the product exists in favorites, render a filled Heart (via fill prop) to indicate "favorited"
            <Heart
              fill="#3b9c3c"
              className="text-shop-light-green/80 group-hover:text-shop-light-green hoverEffect mt-.5 w-5 h-5"
            />
          ) : (
            // If not favorited, render the normal Heart icon
            <Heart className="text-shop-light-green/80 group-hover:text-shop-light-green hoverEffect mt-.5 w-5 h-5" />
          )}
        </button>
      )}
    </>
  );
};

// Export the component so it can be imported and used elsewhere in your app
export default FavoriteButton;
