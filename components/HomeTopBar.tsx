"use client";
import { productType } from "./data";
import Link from "next/link";
interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex items-center flex-wrap gap-5 justify-between">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <div className="flex items-center gap-1.5 md:gap-3">
          {productType?.map((item) => (
            <button
              onClick={() => onTabSelect(item?.title)}
              key={item?.title}
              className={`border border-shop-light-green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full
                 hover:bg-shop-light-green hover:border-shop_light_green hover:text-white hoverEffect 
                 ${selectedTab === item?.title ? "bg-shop_light_green text-black border-shop_light_green" : "bg-shop-light-green/10"}`}
            >
              {item?.title}
            </button>
          ))}
        </div>
      </div>
      <Link
        href={"/shop"}
        className="border border-darkColor px-4 py-1 rounded-full hover:bg-shop-light-green hover:text-white hover:border-shop-light-green hoverEffect"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabbar;
