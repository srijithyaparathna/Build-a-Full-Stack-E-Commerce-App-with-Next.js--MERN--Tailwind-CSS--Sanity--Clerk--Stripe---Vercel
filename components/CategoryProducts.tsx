"use client";

import { Category, Product } from "@/sanity.types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { client } from "@/sanity/lib/client"; // ✅ make sure this path is correct
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";

interface Props {
  categories: Category[];
  slug: string;
}

const CategoryProducts = ({ categories, slug }: Props) => {
  const [currentSlug, setCurrentSlug] = useState(slug); // current category slug
  const [products, setProducts] = useState<Product[]>([]); // fetched products
  const [loading, setLoading] = useState(false); // loading spinner
  const router = useRouter();

  // ✅ Handle when category is switched
  const handleCategoryChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    setCurrentSlug(newSlug);
    router.push(`/category/${newSlug}`, { scroll: false });
  };

  // ✅ Fetch products for a given category slug
  const fetchProducts = async (categorySlug: string) => {
    setLoading(true);
    try {
      const query = `
        *[_type == "product" && (
          references(*[_type == "category" && slug.current == $categorySlug]._id) ||
          $categorySlug in categories[]->slug.current
        )]
        | order(name asc) {
          ...,
          "categories": categories[]->{
            title,
            "slug": slug.current
          }
        }
      `;

      const data = await client.fetch(query, { categorySlug });

      console.log("Fetched products for:", categorySlug, data); // 👀 debug
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch products when component mounts or URL changes
  useEffect(() => {
    fetchProducts(currentSlug);
  }, [currentSlug]);

  return (
    <div className="py-5 flex flex-col md:flex-row items-start gap-5">
      {/* ===================== Category Sidebar ===================== */}
      <div className="flex flex-col md:min-w-40 border rounded-lg overflow-hidden">
        {categories?.map((item) => (
          <Button
            key={item?._id}
            onClick={() => handleCategoryChange(item?.slug?.current as string)}
            className={`bg-transparent border-0 p-0 rounded-none text-darkColor shadow-none 
              hover:bg-shop-orange hover:text-white font-semibold border-b last:border-b-0 
              transition-colors capitalize
              ${
                item?.slug?.current === currentSlug
                  ? "bg-shop-orange text-white border-shop-orange"
                  : ""
              }`}
          >
            <p className="w-full text-left px-3 py-2">{item?.title}</p>
          </Button>
        ))}
      </div>

      {/* ===================== Products Section ===================== */}
      <div className="flex-1">
        {loading ? (
          // ✅ Loading Spinner
          <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-50 rounded-lg w-full">
            <div className="flex items-center space-x-2 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading products...</span>
            </div>
          </div>
        ) : products?.length > 0 ? (
          // ✅ Products Grid
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {products.map((product: Product) => (
              <AnimatePresence key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ) : (
          // ✅ No Products Found
          <NoProductAvailable
            selectedTab={currentSlug}
            className="mt-0 w-full"
            message={`We're sorry, but there are no products matching your "${currentSlug}" criteria at the moment. We're restocking shortly — please check back later or explore other categories.`}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
