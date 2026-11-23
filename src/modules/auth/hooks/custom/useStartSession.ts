import { useNavigate } from "@tanstack/react-router";

import { getGetMeQueryKey, getMe } from "@/api/generated/hooks/account/account";
import type { AuthTokenResponse, MeResponse } from "@/api/generated/models";
import { queryClient } from "@/config/queryClient/queryClient";
import { storeAccessToken } from "@/security/session";

// A token is bound to one active organization, so whenever it changes (login, switching
// organization, joining one) every cached query belongs to the old one and has to go.
// /api/me is fetched with the new token *before* the cache is cleared and put straight back,
// so the signed-in pages never see a moment without it (useCurrentUser throws when it's
// missing, and on a slow connection that moment lasted long enough to show the error).
// Returns undefined when /api/me fails; the cache is then just cleared and the app layout
// loads it again.
const openSession = async (accessToken: string): Promise<MeResponse | undefined> => {
  storeAccessToken(accessToken);
  const me = await getMe().catch(() => undefined);
  queryClient.clear();
  if (me) queryClient.setQueryData(getGetMeQueryKey(), me);
  return me;
};

// Stores a freshly issued token and goes to the dashboard. The app layout then decides where the
// user really belongs (the organization picker when they have no organization yet).
export const useStartSession = () => {
  const navigate = useNavigate();
  return async ({ accessToken }: AuthTokenResponse) => {
    await openSession(accessToken);
    await navigate({ to: "/" });
  };
};

// After logging in: straight to the dashboard when there is nothing to choose (exactly one
// organization and no invitation waiting), otherwise to the organization picker (FLOG-55).
export const useStartLoginSession = () => {
  const navigate = useNavigate();
  return async ({ accessToken }: AuthTokenResponse) => {
    const me = await openSession(accessToken);
    const hasChoice = !me || me.memberships.length !== 1 || me.pendingInvitations.length > 0;
    await navigate({ to: hasChoice ? "/organizations" : "/" });
  };
};
