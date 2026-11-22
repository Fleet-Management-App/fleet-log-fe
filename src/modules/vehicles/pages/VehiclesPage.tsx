import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { Role } from "@/api/generated/models";
import { hasAnyRole } from "@/security/requireRole";
import { useCurrentUser } from "@/security/useCurrentUser";

import { AddVehicleContainer } from "../containers/AddVehicleContainer";
import { VehiclesContainer } from "../containers/VehiclesContainer";

export const VehiclesPage: FC = () => {
  const { t } = useTranslation("vehicles");
  const me = useCurrentUser();
  // Only a Fleet Manager adds vehicles (the BE answers 403 otherwise); everyone else reads the list
  const canAdd = hasAnyRole(me, Role.FLEET_MANAGER);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">{t("page.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("page.subtitle", { organization: me.activeOrganization?.organizationName })}
          </p>
        </div>
        {canAdd && <AddVehicleContainer />}
      </div>
      <VehiclesContainer canAdd={canAdd} />
    </div>
  );
};
