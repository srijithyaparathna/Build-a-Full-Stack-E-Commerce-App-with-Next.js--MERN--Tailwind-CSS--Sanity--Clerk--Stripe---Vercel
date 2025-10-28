import React from "react";
import { getCategories } from "@/sanity/queries";
import { Title } from "@/components/Title";
import Container from "@/components/Container";
import CategoryProducts from "@/components/CategoryProducts";
// server components - runs on the side 


const CategoryPage = async ({params,}:{params:Promise<{slug:string}>;}) => {

// Fetch all categories server side 
const categories = await getCategories();

// extract slug from route params 
const {slug} = await params;

  
  return (
    <div className="py-10">
      <Container>
        {/* Page Title */}
        <Title>
          Products by Category:{" "}
          <span className="font-bold text-green-600 capitalize tracking-wide">
            {slug && slug} {/* ✅ Show current category slug */}
          </span>
        </Title>

        {/* ✅ Category product listing section */}
      <CategoryProducts categories={categories} slug={slug} /> 
      </Container>
    </div>
  );
};
export default CategoryPage;
