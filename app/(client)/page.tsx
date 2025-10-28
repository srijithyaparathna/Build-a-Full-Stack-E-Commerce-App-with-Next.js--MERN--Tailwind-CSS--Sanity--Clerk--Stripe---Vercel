import React from "react";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import ProductGrid from "@/components/ProductGrid";
import HomeCategories from "@/components/HomeCategories";
import { getCategories } from "@/sanity/queries/index"; // ✅ Import category fetch function
import ShopByBrands from "@/components/ShopByBrands";
import LatestBlog from "@/components/LatestBlog";
// ✅ Make component async (Server Component)
const Page = async () => {
  // Fetch categories data from Sanity
  const categories = await getCategories(6);

  return (
    <Container>
      {/* Banner Section */}
      <div className="bg-shop-light-pink">
        <HomeBanner />
      </div>

      {/* Spacer */}
      <div className="py-10"></div>

      {/* Product Grid Section */}
      <ProductGrid />

      {/* Categories Section */}
      <HomeCategories categories={categories} />
      <ShopByBrands/>
      <LatestBlog/>
    </Container>
  );
};

export default Page;
