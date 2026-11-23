import { queryClient } from "@/config/queryClient/queryClient";

const TOKEN_KEY = "fleetlog.accessToken";

export const getAccessToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const hasSession = (): boolean => getAccessToken() !== null;

// Only stores the token. Starting a session also has to replace the cached data, which
// useStartSession does (see openSession there).
export const storeAccessToken = (accessToken: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
};

export const endSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  queryClient.clear();
};
