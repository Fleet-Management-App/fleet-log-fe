import { useNavigate } from "@tanstack/react-router";

import type { AuthTokenResponse } from "@/api/generated/models";
import { startSession } from "@/security/session";

// Stores a freshly issued token and goes to the dashboard. The app layout then decides where the
// user really belongs (e.g. the welcome page when they have no organization yet).
export const useStartSession = () => {
  const navigate = useNavigate();
  return async ({ accessToken }: AuthTokenResponse) => {
    startSession(accessToken);
    await navigate({ to: "/" });
  };
};
