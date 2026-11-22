import { QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const is401Error = (error: unknown): boolean => (error as AxiosError)?.response?.status === 401;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => is401Error(error) && failureCount < 2,
      // Trips and approvals are changed by other people (a driver cancels, a Fleet Manager decides),
      // so data counts as fresh only briefly and is refetched when the user comes back to the tab
      staleTime: 30 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: (failureCount, error) => is401Error(error) && failureCount < 2,
    },
  },
});
