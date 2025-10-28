"use client"
import React from "react";
import { headerData } from "./data";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HeaderMenu = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:inline-flex w-1/3 items-center gap-7 text-sm capitalize font-semibold text-lightColor">
      {headerData?.map((item) => {
        const isActive = pathname === item?.href;
        return (
          <Link
            key={item?.title}
            href={item?.href}
            className="relative group hover:text-shop-light-green hoverEffect"
          >
            {item.title}
            {/* underline left half */}
            <span
              className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-shop-light-green transition-all duration-300 group-hover:left-0 group-hover:w-1/2 ${
                isActive ? "w-1/2 left-0" : ""
              }`}
            />
            {/* underline right half */}
            <span
              className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-shop-light-green transition-all duration-300 group-hover:right-0 group-hover:w-1/2 ${
                isActive ? "w-1/2 right-0" : ""
              }`}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default HeaderMenu;
