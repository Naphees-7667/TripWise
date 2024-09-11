import React from "react";
import { Button } from "../ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

function Check() {
  return (
    <div>
      <header>
        <h1>My Awesome App</h1>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>
      </header>

      <main>
        <SignedIn>
          <h2>Welcome back!</h2>
          <p>This is your protected dashboard.</p>
        </SignedIn>
        <SignedOut>
          <h2>Please sign in to access your dashboard.</h2>
        </SignedOut>
      </main>
    </div>
  );
}

export default Check;
