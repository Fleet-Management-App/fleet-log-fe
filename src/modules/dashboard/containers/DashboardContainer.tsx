import type { FC } from "react";

import { useCurrentUser } from "@/security/useCurrentUser";

import { DashboardHeader } from "../components/DashboardHeader";
import { RoleActions } from "../components/RoleActions";
import { ROLE_ACTIONS } from "../models/roleActions";

export const DashboardContainer: FC = () => {
  const { fullName, activeOrganization } = useCurrentUser();
  // The app layout sends users without an organization to /welcome, so one is always active here
  if (!activeOrganization) return null;

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        fullName={fullName}
        organizationName={activeOrganization.organizationName}
        role={activeOrganization.role}
      />
      <RoleActions actions={ROLE_ACTIONS[activeOrganization.role]} />
    </div>
  );
};
