import { queryClient } from "@/config/queryClient/queryClient";

const TOKEN_KEY = "fleetlog.accessToken";

export const getAccessToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const hasSession = (): boolean => getAccessToken() !== null;

// A token is bound to one active organization, so whenever it changes (login, switching
// organization, joining one) every cached query belongs to the old one and has to go.
export const startSession = (accessToken: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  queryClient.clear();
};

export const endSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  queryClient.clear();
};
