import { createFileRoute, redirect } from "@tanstack/react-router";

import { getGetMeQueryOptions } from "@/api/generated/hooks/account/account";
import { queryClient } from "@/config/queryClient/queryClient";
import { AppLayout } from "@/modules/common/layout/AppLayout";
import { endSession, hasSession } from "@/security/session";

// Every signed-in page sits under this pathless layout. It loads /api/me once, and sends a user
// without an active organization to the welcome page (create an organization or accept an invite).
export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ location }) => {
    if (!hasSession()) throw redirect({ to: "/login" });
    const me = await queryClient.ensureQueryData(getGetMeQueryOptions()).catch(() => {
      endSession();
      throw redirect({ to: "/login" });
    });
    if (!me.activeOrganization && location.pathname !== "/welcome")
      throw redirect({ to: "/welcome" });
  },
  component: AppLayout,
});
