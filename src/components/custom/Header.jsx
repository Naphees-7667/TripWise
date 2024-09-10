import React from "react";
import { Button } from "../ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function Header() {
  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      <div className="flex gap-3 items-center">
        <img src="/logo.svg" alt="TripWise Logo" />
        <h1 className="text-[#340E0E] font-extrabold text-3xl">TripWise</h1>
      </div>
      {/* <div>
        <SignedOut>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton to="/"/>
        </SignedIn>
      </div> */}
      <Button>Sign In</Button>
    </div>
  );
}
export default Header;