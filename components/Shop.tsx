"use client"; // ✅ Enables client-side rendering (because we use React hooks like useState, useEffect)

import { BRANDS_QUERYResult, Category, Product } from "@/sanity.types"; // ✅ TypeScript types for data from Sanity
import React, { useEffect, useState } from "react";
import Container from "./Container"; // ✅ Layout container for consistent page padding/margins
import { Title } from "./Title";
import CategoryList from "./shop/CategoryList";// ✅ Sidebar component to show list of categories
import { useSearchParams } from "next/navigation"; // ✅ Hook to read query parameters from the URL
import BrandList from "./shop/BrandList"; // ✅ Sidebar component to show list of brands
import PriceList from "./shop/PriceList"; // ✅ Sidebar component to show price filter
import { client } from "@/sanity/lib/client"; // ✅ Sanity client instance to fetch data from CMS
import { Loader2 } from "lucide-react"; // ✅ Loading spinner icon
import NoProductAvailable from "./NoProductAvailable"; // ✅ Component displayed when no products found
import ProductCard from "./ProductCard"; // ✅ Product display card component

// ✅ Props interface to type-check what data Shop expects
interface Props {
  categories: Category[];
  brands: BRANDS_QUERYResult;
}

// ✅ Main Shop component
const Shop = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams(); // ✅ Access query params like ?brand=apple&category=phones
  const brandParams = searchParams?.get("brand"); // ✅ Extract brand param from URL
  const categoryParams = searchParams?.get("category"); // ✅ Extract category param from URL

  // ✅ React state hooks
  const [products, setProducts] = useState<Product[]>([]); // All products to be displayed
  const [loading, setLoading] = useState(false); // Loading spinner state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null // ✅ Initialize from URL param if available
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandParams || null // ✅ Initialize from URL param if available
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null); // ✅ Holds selected price range (e.g., "100-500")

  // ✅ Fetch products from Sanity based on selected filters
  const fetchProducts = async () => {
    setLoading(true); // ✅ Show loader while fetching
    try {
      // ✅ Default price range
      let minPrice = 0;
      let maxPrice = 10000;

      // ✅ If user selected a price filter like "100-500", split into min & max
      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      }

      // ✅ GROQ query to fetch products that match filters
      const query = `
      *[_type == 'product' 
        && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
        && (!defined($selectedBrand) || references(*[_type == "brand" && slug.current == $selectedBrand]._id))
        && price >= $minPrice && price <= $maxPrice
      ] 
      | order(name asc) {
        ...,"categories": categories[]->title
      }
    `;

      // ✅ Execute the query with parameters
      const data = await client.fetch(
        query,
        { selectedCategory, selectedBrand, minPrice, maxPrice },
        { next: { revalidate: 0 } } // ✅ Always fetch fresh data (disable caching)
      );

      setProducts(data); // ✅ Save fetched products to state
    } catch (error) {
      console.log("Shop product fetching Error", error);
    } finally {
      setLoading(false); // ✅ Hide loader once done
    }
  };

  // ✅ Re-fetch products every time user changes category, brand, or price
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, selectedPrice]);

  // ✅ JSX structure (UI layout)
  return (
    <div className="border-t">
      <Container className="mt-5">
        {/* Header Section */}
        <div className="sticky top-0 z-10 mb-5">
          <div className="flex items-center justify-between">
            <Title className="text-lg uppercase tracking-wide">
              Get the products as your needs
            </Title>

            {/* ✅ Reset Filters button appears only if filters are active */}
            {(selectedCategory !== null ||
              selectedBrand !== null ||
              selectedPrice !== null) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedBrand(null);
                  setSelectedPrice(null);
                }}
                className="text-shop_dark_green underline text-sm mt-2 font-medium hover:text-darkRed hoverEffect"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Products */}
        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          
          {/* ✅ Left Sidebar (filters) */}
          <div className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop_btn_dark_green/50 scrollbar-hide">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <BrandList
              brands={brands}
              setSelectedBrand={setSelectedBrand}
              selectedBrand={selectedBrand}
            />
            <PriceList
              setSelectedPrice={setSelectedPrice}
              selectedPrice={selectedPrice}
            />
          </div>

          {/* ✅ Right side — Product Grid */}
          <div className="flex-1 pt-5">
            <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide">
              {loading ? (
                // ✅ Show spinner while loading
                <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white">
                  <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
                  <p className="font-semibold tracking-wide text-base">
                    Product is loading . . .
                  </p>
                </div>
              ) : products?.length > 0 ? (
                // ✅ Display product cards if available
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {products?.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                  ))}
                </div>
              ) : (
                // ✅ If no products found
                <NoProductAvailable className="bg-white mt-0" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
