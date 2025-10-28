import React, { FC } from "react";
import Logo from "./Logo";
import { X } from "lucide-react";
import { headerData } from "./data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-full h-screen bg-black/50 text-white/70 shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div
        ref={sidebarRef}
        className="min-w-72 max-w-96 h-screen p-10 bg-black border-r border-r-shop_light_green flex flex-col gap-6"
      >
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between gap-5">
          <Logo className="text-white" spanDesign="group-hover:text-white" />
          <button
            onClick={onClose}
            className="hover:text-shop_light_green transition-colors duration-200"
          >
            <X />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-3.5 font-semibold tracking-wide">
          {headerData?.map((item) => (
            <Link
              href={item?.href}
              key={item?.title}
              className={`transition-colors duration-200 ease-in-out hover:text-white ${
                pathname === item?.href ? "text-white" : ""
              }`}
            >
              {item?.title}
            </Link>
          ))}
        </div>

        {/* Social Media Icons */}
        <SocialMedia />
      </div>
    </div>
  );
};

export default SideMenu;
