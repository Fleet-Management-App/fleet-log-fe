import { redirect } from "@tanstack/react-router";

import { getGetMeQueryKey } from "@/api/generated/hooks/account/account";
import type { MeResponse, Role } from "@/api/generated/models";
import { queryClient } from "@/config/queryClient/queryClient";

/** True when the caller holds at least one of [roles] in the active organization. */
export const hasAnyRole = (me: MeResponse | undefined, ...roles: Role[]): boolean =>
  roles.some((role) => me?.activeOrganization?.roles.includes(role));

/**
 * For a route's beforeLoad: sends a caller without any of [roles] to the dashboard. The BE enforces
 * the same with 403; this only keeps people off pages they can't use. /api/me is already loaded by
 * the _app layout route.
 */
export const requireAnyRole = (...roles: Role[]) => {
  const me = queryClient.getQueryData<MeResponse>(getGetMeQueryKey());
  if (!hasAnyRole(me, ...roles)) throw redirect({ to: "/" });
};
