import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./Route/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./Context/AuthProvider/AuthProvider";
import BlogProvider from "./Context/BlogProvider/BlogProvider";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BlogProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" reverseOrder={false} />
      </BlogProvider>
    </AuthProvider>
  </QueryClientProvider>
);
