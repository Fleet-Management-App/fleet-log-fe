import type { FC } from "react";

import type { Role } from "@/api/generated/models";
import { Badge } from "@/modules/common/components/ui/badge";
import { ROLE_LABELS, sortRoles } from "@/modules/common/utils/roles";

type DashboardHeaderProps = {
  fullName: string;
  organizationName: string;
  roles: Role[];
};

export const DashboardHeader: FC<DashboardHeaderProps> = ({
  fullName,
  organizationName,
  roles,
}) => (
  <div className="flex flex-col gap-1">
    <h1 className="text-2xl font-semibold">Hello, {fullName.split(" ")[0]}</h1>
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      {organizationName}
      {sortRoles(roles).map((role) => (
        <Badge key={role} variant="secondary">
          {ROLE_LABELS[role]}
        </Badge>
      ))}
    </p>
  </div>
);
