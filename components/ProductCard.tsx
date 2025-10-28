// Importing necessary modules and components
import { Product } from "@/sanity.types";                // Importing the Product type (TypeScript interface) from Sanity schema definitions
import { urlFor } from "@/sanity/lib/image";             // Helper function from Sanity to generate image URLs
import Image from "next/image";                          // Optimized image component from Next.js
import React from "react";                               // React library
import Link from "next/link";                            // Next.js component for client-side navigation
import { StarIcon } from "@sanity/icons";                // Star icon from Sanity’s icon set
import { Flame } from "lucide-react";                    // Flame icon from Lucide (used for “hot deals”)
import PriceView from "./PriceView";                     // Custom component to show product price and discounts
import { Title } from "./Title";                         // Custom title component (probably for consistent styling)
import ProductSideMenu from "./ProductSideMenu";         // Side menu for product actions (wishlist, compare, etc.)
import AddToCartButton from "./AddToCartButton";      

// ProductCard component definition — receives a single `product` prop of type `Product`
const ProductCard = ({ product }: { product: Product }) => {
  return (
    // Outer card container — rounded border, light background, hover effects handled via `group`
    <div className="text-sm border-[1px] rounded-md border-darkBlue/20 group bg-white">

      {/* Image section (top half of card) */}
      <div className="relative group overflow-hidden bg-shop_light_bg">

        {/* Conditional: only render image if product has images */}
        {product?.images && (
          <Link href={`/product/${product?.slug?.current}`}> {/* Navigate to product detail page */}
            <Image
              src={urlFor(product.images[0]).url()}          // Generate image URL from Sanity
              alt="productImage"                             // Alt text for accessibility
              width={500}
              height={500}
              priority                                       // Next.js flag to load this image with high priority
              className={`w-full h-64 object-contain overflow-hidden transition-transform bg-shop_light_bg duration-500 
              ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`} // Zoom on hover if in stock, fade if not
            />
          </Link>
        )}

        {/* Product side menu (e.g., wishlist, quick view, etc.) */}
         <ProductSideMenu product={product} /> 

        {/* Conditional label — show “Sale!” badge or a flame icon for deals */}
        {product?.status === "sale" ? (
          // Sale badge when status is 'sale'
          <p className="absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 rounded-full group-hover:border-lightGreen hover:text-shop_dark_green hoverEffect">
            Sale!
          </p>
        ) : (
          // Flame icon link for deals
          <Link
            href={"/deal"}  // Takes user to deals page
            className="absolute top-2 left-2 z-10 border border-shop_orange/50 p-1 rounded-full group-hover:border-shop_orange hover:text-shop_dark_green hoverEffect"
          >
            <Flame
              size={18}
              fill="#fb6c08"  // Fill color for the flame
              className="text-shop_orange/50 group-hover:text-shop_orange hoverEffect"
            />
          </Link>
        )}
      </div>

      {/* Product details section (bottom half of card) */}
      <div className="p-3 flex flex-col gap-2">

        {/* Product categories (if available) */}
        {product?.categories && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-lightText">
            {product.categories.map((cat) => cat).join(", ")} {/* Display categories as comma-separated text */}
          </p>
        )}

        {/* Product title */}
        <Title className="text-sm line-clamp-1">{product?.name}</Title>

        {/* Star rating section */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              // Display 5 stars — first 4 filled, last 1 unfilled
              <StarIcon
                key={index}
                className={index < 4 ? "text-shop_light_green" : " text-lightText"}
                fill={index < 4 ? "#93D991" : "#ababab"}  // Green fill for filled stars, gray for empty
              />
            ))}
          </div>
          <p className="text-lightText text-xs tracking-wide">5 Reviews</p> {/* Static text for review count */}
        </div>

        {/* Stock status */}
        <div className="flex items-center gap-2.5">
          <p className="font-medium">In Stock</p>
          <p
            className={`${
              product?.stock === 0
                ? "text-red-600" // Red if out of stock
                : "text-shop_dark_green/80 font-semibold" // Green if available
            }`}
          >
            {/* Show actual stock count or "unavailable" if 0 */}
            {(product?.stock as number) > 0 ? product?.stock : "unavailable"}
          </p>
        </div>

        {/* Price display (uses PriceView component for discount handling) */}
        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-sm"
        />

        {/* Add to Cart button */}
        <AddToCartButton product={product} className="w-36 rounded-full" />
      </div>
    </div>
  );
};

// Export the component as default
export default ProductCard;