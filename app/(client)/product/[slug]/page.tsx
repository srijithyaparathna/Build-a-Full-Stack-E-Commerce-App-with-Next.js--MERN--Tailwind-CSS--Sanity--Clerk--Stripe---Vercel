import React from 'react'


import AddToCartButton from '@/components/AddToCartButton'
import Container from '@/components/Container'
import FavoriteButton from '@/components/FavoriteButton'
import ImageView from '@/components/ImageView'
import PriceView from '@/components/PriceView'
import ProductCharacteristics from '@/components/ProductCharacteristics'

// Importing the sanity query function to fetch product data
import { getProductBySlug } from '@/sanity/queries'

// Importing icons from external libraries
import { CornerDownLeft, StarIcon, Truck } from "lucide-react";
import { notFound } from "next/navigation"; // Used to handle 404 (Not Found) pages

import { FaRegQuestionCircle } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { RxBorderSplit } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb";








const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>; // Type definition for dynamic route parameter (slug)
}) => {

    // Awaiting params to extract slug from the URL 
    const {slug} = await params;

    // Fetching product details from sanity using product slug
    const product = await getProductBySlug(slug);

    // If no product is found render next.js 404 page 
    if (!product){
        return notFound();
    }

  // Component render section
  return (
    // Container provides consistent page padding and responsive layout
    <Container className="flex flex-col md:flex-row gap-10 py-10">
      {/* Product image viewer on the left side */}
      {product?.images && (
        <ImageView images={product?.images} isStock={product?.stock} />
      )}

      {/* Product details on the right side */}
      <div className="w-full md:w-1/2 flex flex-col gap-5">

        {/* === Product Title, Description, and Rating === */}
        <div className="space-y-1">
          {/* Product name */}
          <h2 className="text-2xl font-bold">{product?.name}</h2>

          {/* Product short description */}
          <p className="text-sm text-gray-600 tracking-wide">
            {product?.description}
          </p>

          {/* Product rating section (5 static stars + review count) */}
          <div className="flex items-center gap-0.5 text-xs">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                size={12}
                className="text-shop_light_green"
                fill={"#3b9c3c"} // Filled star color
              />
            ))}
            <p className="font-semibold">{`(120)`}</p>
          </div>
        </div>

        {/* === Price and Stock Section === */}
        <div className="space-y-2 border-t border-b border-gray-200 py-5">
          {/* Display product price with discount if available */}
          <PriceView
            price={product?.price}
            discount={product?.discount}
            className="text-lg font-bold"
          />

          {/* Show stock status with conditional color */}
          <p
            className={`px-4 py-1.5 text-sm text-center inline-block font-semibold rounded-lg ${
              product?.stock === 0
                ? "bg-red-100 text-red-600"
                : "text-green-600 bg-green-100"
            }`}
          >
            {(product?.stock as number) > 0 ? "In Stock" : "Out of Stock"}
          </p>
        </div>

        {/* === Action Buttons (Add to Cart & Favorite) === */}
        <div className="flex items-center gap-2.5 lg:gap-3">
          <AddToCartButton product={product} /> {/* Add to Cart button */}
          <FavoriteButton showProduct={true} product={product} /> {/* Wishlist */}
        </div>

        {/* === Product Features / Specifications === */}
        <ProductCharacteristics product={product} />

        {/* === Quick Action Row (Compare, Ask Question, etc.) === */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-b-gray-200 py-5 -mt-2">
          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <RxBorderSplit className="text-lg" />
            <p>Compare color</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <FaRegQuestionCircle className="text-lg" />
            <p>Ask a question</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <TbTruckDelivery className="text-lg" />
            <p>Delivery & Return</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
            <FiShare2 className="text-lg" />
            <p>Share</p>
          </div>
        </div>

        {/* === Delivery and Return Info Section === */}
        <div className="flex flex-col">
          {/* Free Delivery Info */}
          <div className="border border-lightColor/25 border-b-0 p-3 flex items-center gap-2.5">
            <Truck size={30} className="text-shop_orange" />
            <div>
              <p className="text-base font-semibold text-black">
                Free Delivery
              </p>
              <p className="text-sm text-gray-500 underline underline-offset-2">
                Enter your Postal code for Delivey Availability.
              </p>
            </div>
          </div>

          {/* Return Policy Info */}
          <div className="border border-lightColor/25 p-3 flex items-center gap-2.5">
            <CornerDownLeft size={30} className="text-shop_orange" />
            <div>
              <p className="text-base font-semibold text-black">
                Return Delivery
              </p>
              <p className="text-sm text-gray-500 ">
                Free 30days Delivery Returns.{" "}
                <span className="underline underline-offset-2">Details</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default SingleProductPage