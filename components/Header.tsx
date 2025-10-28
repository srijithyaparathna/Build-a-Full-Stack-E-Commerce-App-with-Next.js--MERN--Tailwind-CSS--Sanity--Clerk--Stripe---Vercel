import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Logs } from "lucide-react";
import { getMyOrders } from "@/sanity/queries";

const Header = async () => {
  // Fetch current user and authentication info
  const user = await currentUser();
  const { userId } = await auth();

  // Initialize variable to hold order data
  let orders = null;

  // If user is authenticated, fetch their orders
  if (userId) {
    orders = await getMyOrders(userId);
  }

  return (
    // The header is sticky, semi-transparent, and has a blur effect
    <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md">
      {/* Container centers and spaces content horizontally */}
      <Container className="flex items-center justify-between text-lightColor">
        
        {/* Left Section: Logo and Mobile Menu */}
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu /> {/* Appears on small screens */}
          <Logo /> {/* Company or app logo */}
        </div>

        {/* Middle Section: Navigation Menu */}
        <HeaderMenu />

        {/* Right Section: Search, Cart, Favorites, and User */}
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar /> {/* Product search */}
          <CartIcon /> {/* Shopping cart icon */}
          <FavoriteButton /> {/* Wishlist/favorite icon */}

          {/* Orders icon — only shown when user is logged in */}
          {user && (
            <Link
              href={"/orders"}
              className="group relative hover:text-shop_light_green hoverEffect"
            >
              <Logs /> {/* "Orders" icon from lucide-react */}

              {/* Small badge displaying total number of orders */}
              <span className="absolute -top-1 -right-1 bg-shop-btn-darkgreen text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                {orders?.length ? orders?.length : 0}
              </span>
            </Link>
          )}

          {/* Clerk Authentication Handling */}
          <ClerkLoaded>
            {/* If user is logged in, show profile picture button */}
            <SignedIn>
              <UserButton />
            </SignedIn>

            {/* If user is not logged in, show SignIn button */}
            {!user && <SignIn />}
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};

export default Header;
