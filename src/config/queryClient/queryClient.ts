import { QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const is401Error = (error: unknown): boolean => (error as AxiosError)?.response?.status === 401;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => is401Error(error) && failureCount < 2,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: (failureCount, error) => is401Error(error) && failureCount < 2,
    },
  },
});
