import { createFileRoute, redirect } from "@tanstack/react-router";

import { getMeQueryKey } from "@/api/generated/hooks/account/account";
import { type MeResponse, Role } from "@/api/generated/models";
import { queryClient } from "@/config/queryClient/queryClient";
import { MembersPage } from "@/modules/users/pages/MembersPage";

// Fleet Managers only (SPEC-08); the BE enforces the same with 403
export const Route = createFileRoute("/_app/organization/members")({
  beforeLoad: () => {
    const me = queryClient.getQueryData<MeResponse>(getMeQueryKey());
    if (me?.activeOrganization?.role !== Role.FLEET_MANAGER) throw redirect({ to: "/" });
  },
  component: MembersPage,
});
