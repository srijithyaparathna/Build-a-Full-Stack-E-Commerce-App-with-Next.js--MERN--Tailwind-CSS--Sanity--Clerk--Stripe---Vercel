"use client"; 
// This marks the file as a client component in Next.js (used when working with hooks or browser-only code).

import { Product } from "@/sanity.types"; 
// Importing the 'Product' type definition from Sanity schema types.

import { Button } from "./ui/button"; 
// Importing a reusable Button component (likely from your UI library).

import { cn } from "@/lib/utils"; 
// 'cn' is a utility function used to conditionally merge CSS class names.

import { ShoppingBag } from "lucide-react"; 
// Importing a shopping bag icon from the Lucide React icon library.

import useStore from "@/store"; 
// Importing your global store hook (probably Zustand or similar) for managing cart state.

import toast from "react-hot-toast"; 
// Importing a toast notification library to show success/error messages.

import PriceFormatter from "./PriceFormatter"; 
// A utility component that formats price values into currency format.

import QuantityButtons from "./QuantityButtons"; 
// A component that handles increasing/decreasing product quantity in the cart.


interface Props {
  product: Product;     // The product object to be added to cart.
  className?: string;   // Optional CSS class name for custom styling.
}

// Functional component definition
const AddToCartButton = ({ product, className }: Props) => {
  // Extract 'addItem' (to add a product to cart) and 'getItemCount' (to check existing quantity)
  const { addItem, getItemCount } = useStore();

  // Get the number of this specific product currently in the cart
  const itemCount = getItemCount(product?._id);

  // Check if the product is out of stock (quantity = 0)
  const isOutOfStock = product?.stock === 0;


  // Function called when "Add to Cart" button is clicked
  const handleAddToCart = () => {
    // Allow adding only if available stock is greater than current quantity in cart
    if ((product?.stock as number) > itemCount) {
      addItem(product); // Add the product to the cart
      // Show a success message (truncate product name to 12 characters for neatness)
      toast.success(`${product?.name?.substring(0, 12)}... added successfully!`);
    } else {
      // If user tries to add more than stock available, show an error message
      toast.error("Can not add more than available stock");
    }
  };


  // JSX returned by the component
  return (
    <div className="w-full h-12 flex items-center">
      {/* If the product is already in the cart (itemCount > 0) */}
      {itemCount ? (
        <div className="text-sm w-full">
          {/* Quantity section */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-darkColor/80">Quantity</span>
            {/* Render the QuantityButtons component to control quantity */}
           <QuantityButtons product={product} /> 
          </div>

          {/* Subtotal section (price * quantity) */}
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            {/* Format and display the subtotal amount */}
             <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
            /> 
          </div>
        </div>
      ) : (
        // If item is not in cart yet, show the "Add to Cart" button
        <Button
          onClick={handleAddToCart}         // Attach click handler
          disabled={isOutOfStock}           // Disable if out of stock
          className={cn(
            // Merge base button styles with any optional className passed in props
            "w-full bg-shop-dark-green/80 text-lightBg shadow-none border border-shop-dark-green/80 font-semibold tracking-wide text-white hover:bg-shop-btn-dark-green hover:border-shop-dark-green hoverEffect",
            className
          )}
        >
          {/* Button content: icon + label */}
          <ShoppingBag /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton; 
// Exporting the component for use in other parts of the application.
