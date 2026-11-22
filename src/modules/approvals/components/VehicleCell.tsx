import type { FC } from "react";

import { useTranslation } from "react-i18next";

import type { VehicleResponse } from "@/api/generated/models";

export const VehicleCell: FC<{ vehicle?: VehicleResponse }> = ({ vehicle }) => {
  const { t } = useTranslation("approvals");

  if (!vehicle) return <span className="text-muted-foreground">{t("unknownVehicle")}</span>;
  return (
    <div className="flex flex-col">
      <span>
        {vehicle.make} {vehicle.model}
      </span>
      <span className="text-xs text-muted-foreground">{vehicle.plate}</span>
    </div>
  );
};
