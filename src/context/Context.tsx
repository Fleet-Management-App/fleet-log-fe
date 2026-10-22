import { type FC, type ReactNode, StrictMode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { queryClient } from "@/config/queryClient/queryClient";

export const Context: FC<{ children: ReactNode }> = ({ children }) => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" richColors />
      {children}
    </QueryClientProvider>
  </StrictMode>
);
