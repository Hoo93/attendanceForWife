"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { ToastContainer, ToastContainerProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProvidersProps extends ToastContainerProps {
  children: React.ReactNode;
}

function Providers({ children, ...toastProps }: ProvidersProps) {
  const [client] = React.useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <ReactQueryStreamedHydration>
        <ToastContainer {...toastProps} />
        {children}
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
}

export default Providers;
