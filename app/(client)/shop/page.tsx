// app/shop/page.tsx
import Shop from "@/components/Shop";
import { getAllBrands, getCategories } from "@/sanity/queries";
import React from "react";

const ShopPage = async () => {
  // ✅ Call and await both functions properly
  const categories = await getCategories();
  const brands = await getAllBrands();

  // ✅ Pass their *data*, not the function itself
  return (
    <div className="bg-white">
      <Shop categories={categories} brands={brands} />
    </div>
  );
};

export default ShopPage;
