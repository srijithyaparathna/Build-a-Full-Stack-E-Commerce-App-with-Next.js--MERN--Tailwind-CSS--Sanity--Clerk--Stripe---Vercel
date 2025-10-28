import { error } from "console";
import { sanityFetch } from "../lib/live";

// Import all GROQ queries used for fetching different data from sanity

// Import all GROQ queries used for fetching different data from Sanity
import {
  BLOG_CATEGORIES,
  BRAND_QUERY,
  BRANDS_QUERY,
  DEAL_PRODUCTS,
  GET_ALL_BLOG,
  LATEST_BLOG_QUERY,
  MY_ORDERS_QUERY,
  OTHERS_BLOG_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  SINGLE_BLOG_QUERY,
} from "./query";

// ---------------------------
// Fetch all product categories 
// optionally limit the number of categories using quantity
// Each category also includes a count of how many product reference it 
// ---------------------------

 
const getCategories = async (quantity?:number)=> {
    try{
        // If quantity is given fetch that many categories
           // If `quantity` is given, fetch that many categories
    const query = quantity
      ? `*[_type == 'category'] | order(name asc) [0...$quantity] {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`
      // Otherwise, fetch all categories
      : `*[_type == 'category'] | order(name asc) {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`;

        const {data} = await sanityFetch({
            query,
            params:quantity ? {quantity}: {}
        })

        // retuen data
        return data;

    }
    catch(error){
        console.log("Error fetching categories,",error);
        return [];
    }
}


// Fetch all available brands from sanity 
const getAllBrands = async () => {
    try{
        const {data} = await sanityFetch({query:BRANDS_QUERY});
        return data ?? [];
    }
    catch(error){
        console.log("Error fetching all brands",error);
        return [];
    }
};

// fetch the latest blog posts 
const getLatestBlogs = async () => {
    try{
        const {data} = await sanityFetch({query:LATEST_BLOG_QUERY});
        return data ?? [] ;
    }
    catch(error){
        console.log("Error Fetching latest Blogs",error);
        return [];
    }
};

// Fetch all deal discounted products 
const getDealProducts = async () => {
   try{ const {data} = await sanityFetch({query:DEAL_PRODUCTS})
        return data ?? [];
    }
   catch{
    console.log("Error fetching deal products : " ,error);
    return [];

   }
};

// fetch a single product by its unique slug 
const getProductBySlug = async (slug:string)=> {
    try{
        const product = await sanityFetch({
            query : PRODUCT_BY_SLUG_QUERY,
            params:{slug},
        });
        return product?.data || null;
    }
    catch(error) {
        console.error("Error fetching product by ID ",error);
        return null;
    }
};

// fetch a single brand by its slug
const getBrand = async (slug:string)=> {
    try{
        const product = await sanityFetch({
            query:BRANDS_QUERY,
            params:{slug},
        });
        return product?.data || null;
    }
    catch(error){
        console.error("Error fetching product by ID",error);
        return null; 
    }
}

// Fetch orders belonging to a specific user (By userID)
const getMyOrders = async (userId: string) => {
    try{
        const orders = await sanityFetch({
            query:MY_ORDERS_QUERY,
            params:{userId},
        });
        return orders?.data || null;
    }
    catch(error){
        console.error("Error fetching product by ID : ",error);
        return null;
    }
};

// Fetch all blog posts with a specified quantity (limit)
const getAllBlogs = async (quantity:number) => {
    try{
        const {data} = await sanityFetch({
            query:GET_ALL_BLOG,
            params:{quantity},
        });
        return data ?? [];
    }
    catch(error){
        console.log("Error fetching all brands:",error);
        return [];
    }
};



// ────────────────────────────────
// Fetch a single blog post by slug
// ────────────────────────────────
const getSingleBlog = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: SINGLE_BLOG_QUERY,
      params: { slug },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};


// ────────────────────────────────
// Fetch all blog categories
// ────────────────────────────────
const getBlogCategories = async () => {
  try {
    const { data } = await sanityFetch({
      query: BLOG_CATEGORIES,
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};


// ────────────────────────────────
// Fetch “other” related blogs excluding the current one
// Useful for showing recommended or similar posts
// ────────────────────────────────
const getOthersBlog = async (slug: string, quantity: number) => {
  try {
    const { data } = await sanityFetch({
      query: OTHERS_BLOG_QUERY,
      params: { slug, quantity },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};


// ────────────────────────────────
// Export all data-fetching functions for use across the app
// ────────────────────────────────
export {
  getCategories,
  getAllBrands,
  getLatestBlogs,
  getDealProducts,
  getProductBySlug,
  getBrand,
  getMyOrders,
  getAllBlogs,
  getSingleBlog,
  getBlogCategories,
  getOthersBlog,
};















