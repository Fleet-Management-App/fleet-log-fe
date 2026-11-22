import type { FC } from "react";

import { sortRoles } from "@/modules/common/utils/roles";
import { useCurrentUser } from "@/security/useCurrentUser";

import { DashboardHeader } from "../components/DashboardHeader";
import { RoleActions } from "../components/RoleActions";
import { ROLE_ACTIONS } from "../models/roleActions";

export const DashboardContainer: FC = () => {
  const { fullName, activeOrganization } = useCurrentUser();
  // The app layout sends users without an organization to /organizations, so one is always active here
  if (!activeOrganization) return null;

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        fullName={fullName}
        organizationName={activeOrganization.organizationName}
        roles={activeOrganization.roles}
      />
      {/* Someone with several roles sees the tiles of all of them (how to present this is still open) */}
      <RoleActions
        actions={sortRoles(activeOrganization.roles).flatMap((role) => ROLE_ACTIONS[role])}
      />
    </div>
  );
};
