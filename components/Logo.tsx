import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      className={cn(
        "group block w-full",          // ✅ block-level link covers full width
        className
      )}
    >
      <h2 className="text-2xl text-shop-dark-green font-black tracking-wider uppercase hover:text-shop-light-green hoverEffect font-sans">
        Shopcar
        <span className="text-shop-light-green group-hover:text-shop-dark-green hoverEffect ">
          t
        </span>
      </h2>
    </Link>
  );
};

export default Logo;
