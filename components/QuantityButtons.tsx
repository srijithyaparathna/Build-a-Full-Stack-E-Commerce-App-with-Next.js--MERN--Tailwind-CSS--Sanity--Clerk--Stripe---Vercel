import React from 'react'

// importing the product type schema from sanity to type-check product props
import { Product } from '@/sanity.types'

import useStore from '@/store'
// import the zustand global store 

import { Button } from './ui/button'


import { Minus,Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

import toast from 'react-hot-toast'


// Props Definition 
interface Props {
  product:Product; // The product to control for quantity management
  className?:string; // Optional css class for custom styling 
}



// ============ Component Definition =============
const QuantityButtons = ({ product, className }: Props) => {

  // Destructure methods from zustand store
  const {addItem,removeItem,getItemCount} = useStore();

  // Get the current quantity of this product in the cart 
  const itemCount = getItemCount(product?._id);

  // Check if the product is out of stock 
  const isOutOfStock = product?.stock === 0;

  // ====== + Handle Increase Quantity 
  const handleAddToCart =() => {
    // check if adding one more item exceeds available stock 
    if((product?.stock as number)>itemCount){
      addItem(product); // add one quantity
      toast.success("Quantity Increase successfully");
     } else {
      toast.error("Can not add more than available stock");
     }
  };

    // ---------- ➖ Handle Decreasing Quantity ----------
  const handleRemoveProduct = () => {
    // Call store function to remove one quantity (or item entirely if it was the last one)
    removeItem(product?._id);

    // Show success toast based on whether quantity just decreased or item was removed completely
    if (itemCount > 1) {
      toast.success("Quantity Decreased successfully!");
    } else {
      toast.success(`${product?.name?.substring(0, 12)} removed successfully!`);
    }
  };



  return (
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      {/* ➖ Minus Button (decrease quantity) */}
      <Button
        onClick={handleRemoveProduct}                 // Trigger remove logic
        variant="outline"                            // Use outlined button style
        size="icon"                                  // Make button square icon-sized
        disabled={itemCount === 0 || isOutOfStock}   // Disable if item not in cart or out of stock
        className="w-6 h-6 border-[1px] hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Minus />  {/* Icon inside button */}
      </Button>

      {/* Display current quantity */}
      <span className="font-semibold text-sm w-6 text-center text-darkColor">
        {itemCount}
      </span>

      {/* ➕ Plus Button (increase quantity) */}
      <Button
        onClick={handleAddToCart}        // Trigger add logic
        variant="outline"                // Same button style as minus
        size="icon"
        disabled={isOutOfStock}          // Disable if product is out of stock
        className="w-6 h-6 border-[1px] hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Plus />  {/* Icon inside button */}
      </Button>
    </div>
  );

};



export default QuantityButtons