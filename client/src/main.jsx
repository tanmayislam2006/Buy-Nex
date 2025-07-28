import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./Route/Router";
import Provider from "./Context/Provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast"; 
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} /> 
    </Provider>
  </QueryClientProvider>
);
