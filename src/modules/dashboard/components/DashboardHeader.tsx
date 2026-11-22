import type { FC } from "react";

import { useTranslation } from "react-i18next";

import type { Role } from "@/api/generated/models";
import { Badge } from "@/modules/common/components/ui/badge";
import { sortRoles, useRoleLabels } from "@/modules/common/utils/roles";

type DashboardHeaderProps = {
  fullName: string;
  organizationName: string;
  roles: Role[];
};

export const DashboardHeader: FC<DashboardHeaderProps> = ({
  fullName,
  organizationName,
  roles,
}) => {
  const { t } = useTranslation("dashboard");
  const { getRoleLabel } = useRoleLabels();

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold">
        {t("greeting", { firstName: fullName.split(" ")[0] })}
      </h1>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        {organizationName}
        {sortRoles(roles).map((role) => (
          <Badge key={role} variant="secondary">
            {getRoleLabel(role)}
          </Badge>
        ))}
      </p>
    </div>
  );
};
