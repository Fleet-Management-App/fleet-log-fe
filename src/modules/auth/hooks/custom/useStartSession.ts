import { useNavigate } from "@tanstack/react-router";

import { getGetMeQueryKey, getMe } from "@/api/generated/hooks/account/account";
import type { AuthTokenResponse, MeResponse } from "@/api/generated/models";
import { queryClient } from "@/config/queryClient/queryClient";
import { storeAccessToken } from "@/security/session";

// A token is bound to one active organization, so whenever it changes (login, switching
// organization, joining one) every cached query belongs to the old one and has to go.
// - /api/me is fetched with the new token first and then written over the cached one, so the
//   signed-in pages never see a moment without it (useCurrentUser throws when it's missing).
// - Everything else is reset (data dropped, what's on screen refetched with the new token).
// Not queryClient.clear(): it removes the cached queries, but the components on screen stay
// subscribed to the removed ones and keep showing the old organization until they happen to
// re-render, so a switch looked like it needed a second click.
// Returns undefined when /api/me fails; it is then just refetched.
const openSession = async (accessToken: string): Promise<MeResponse | undefined> => {
  storeAccessToken(accessToken);
  const meKey = getGetMeQueryKey();
  const me = await getMe().catch(() => undefined);
  const isMe = ({ queryKey }: { queryKey: readonly unknown[] }) => queryKey[0] === meKey[0];
  if (me) queryClient.setQueryData(meKey, me);
  else void queryClient.invalidateQueries({ queryKey: meKey });
  void queryClient.resetQueries({ predicate: (query) => !isMe(query) });
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
