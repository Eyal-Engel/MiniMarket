import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { Slide } from "react-toastify";
import { createRoot } from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastContainer
        draggable
        limit={3}
        rtl={true}
        closeOnClick
        pauseOnHover
        autoClose={3000}
        pauseOnFocusLoss
        transition={Slide}
        newestOnTop={false}
        position="bottom-right"
        hideProgressBar={false}
      />
    </QueryClientProvider>
  </StrictMode>
);
