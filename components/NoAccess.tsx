import React from "react";
// Imports React to enable JSX and functional component usage.

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
// Imports reusable UI components for building a styled Card layout (header, footer, content).

import Logo from "./Logo";
// Imports the custom Logo component for branding (displayed at the top).

import { SignInButton, SignUpButton } from "@clerk/nextjs";
// Imports Clerk authentication buttons — these open modal popups for login and signup.

import { Button } from "./ui/button";
// Imports the reusable Button component for consistent styling.


/* 
  🧩 Component: NoAccess
  This component is displayed when a user tries to access a protected page (like Cart)
  without being logged in.
  It encourages the user to sign in or create an account.
*/
const NoAccess = ({
  details = "Log in to view your cart items and checkout. Don't miss out on your favorite products!",
}: {
  details?: string; // Optional prop allowing custom message to be displayed.
}) => {
  return (
    // Outer container that centers the card both vertically and horizontally.
    <div className="flex items-center justify-center py-12 md:py-32 bg-gray-100 p-4">
      
      {/* Card container to hold the logo, text, and buttons */}
      <Card className="w-full max-w-md p-5">
        
        {/* Header section: shows logo and welcome title */}
        <CardHeader className="flex items-center flex-col">
          <Logo /> {/* App logo */}
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back!
          </CardTitle>
        </CardHeader>

        {/* Content section: message and sign-in button */}
        <CardContent className="space-y-4">
          {/* Info text displayed under the title */}
          <p className="text-center font-medium text-darkColor/80">{details}</p>
          
          {/* Clerk sign-in modal button */}
          <SignInButton mode="modal">
            <Button className="w-full" size="lg">
              Sign in
            </Button>
          </SignInButton>
        </CardContent>

        {/* Footer section: sign-up prompt and button */}
        <CardFooter className="flex flex-col space-y-2">
          {/* Small text prompting user to create an account */}
          <div className="text-sm text-muted-foreground text-center">
            Don&rsquo;t have an account?
          </div>

          {/* Clerk sign-up modal button */}
          <SignUpButton mode="modal">
            <Button variant="outline" className="w-full" size="lg">
              Create an account
            </Button>
          </SignUpButton>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoAccess;
// Exports the component so it can be used in other pages (like the CartPage).
