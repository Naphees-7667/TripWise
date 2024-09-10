import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from '@clerk/clerk-react'

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import CreateTrip from "./create-trip/index.jsx";

import Header from "./components/custom/Header.jsx";
import { Toaster } from "sonner";


// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/create-trip",
    element: <CreateTrip />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/"> */}
      <Header />
      <Toaster />
      <RouterProvider router={router} />
    {/* </ClerkProvider> */}
  </StrictMode>
);