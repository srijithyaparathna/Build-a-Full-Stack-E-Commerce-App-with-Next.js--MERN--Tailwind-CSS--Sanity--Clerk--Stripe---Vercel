"use client";
import { cn } from "@/lib/utils";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

const ProductSideMenu = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();

  // Check if this product is already in favorites
  const isFavorite = favoriteProduct?.some(
    (item) => item?._id === product?._id
  );

  // Toggle favorite status
  const handleFavorite = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (product?._id) {
      addToFavorite(product).then(() => {
        toast.success(
          isFavorite
            ? "Product removed successfully!"
            : "Product added successfully!"
        );
      });
    }
  };

  return (
    <div
      className={cn("absolute top-2 right-2 hover:cursor-pointer", className)}
    >
      <div
        onClick={handleFavorite}
        className={cn(
          "p-2.5 rounded-full hover:bg-shop-dark-green/80 hover:text-white hoverEffect",
          isFavorite
            ? "bg-shop-dark-green/80 text-white"
            : "bg-lightColor/10 text-darkColor"
        )}
      >
        <Heart size={15} />
      </div>
    </div>
  );
};

export default ProductSideMenu;
