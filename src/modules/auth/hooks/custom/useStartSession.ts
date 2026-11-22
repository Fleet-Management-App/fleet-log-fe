import { useNavigate } from "@tanstack/react-router";

import { getGetMeQueryOptions } from "@/api/generated/hooks/account/account";
import type { AuthTokenResponse } from "@/api/generated/models";
import { queryClient } from "@/config/queryClient/queryClient";
import { startSession } from "@/security/session";

// Stores a freshly issued token and goes to the dashboard. The app layout then decides where the
// user really belongs (the organization picker when they have no organization yet).
export const useStartSession = () => {
  const navigate = useNavigate();
  return async ({ accessToken }: AuthTokenResponse) => {
    startSession(accessToken);
    await navigate({ to: "/" });
  };
};

// After logging in: straight to the dashboard when there is nothing to choose (exactly one
// organization and no invitation waiting), otherwise to the organization picker (FLOG-55).
export const useStartLoginSession = () => {
  const navigate = useNavigate();
  return async ({ accessToken }: AuthTokenResponse) => {
    startSession(accessToken);
    const me = await queryClient.fetchQuery(getGetMeQueryOptions()).catch(() => undefined);
    const hasChoice = !me || me.memberships.length !== 1 || me.pendingInvitations.length > 0;
    await navigate({ to: hasChoice ? "/organizations" : "/" });
  };
};
