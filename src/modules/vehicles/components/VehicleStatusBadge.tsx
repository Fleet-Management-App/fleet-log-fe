import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { VehicleStatus } from "@/api/generated/models";
import { Badge } from "@/modules/common/components/ui/badge";
import { cn } from "@/modules/common/lib/utils";

// Same chip style as the trip statuses: green in use, amber in the workshop, red taken out
const STATUS_CLASSES: Record<VehicleStatus, string> = {
  [VehicleStatus.ACTIVE]: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  [VehicleStatus.IN_SERVICE]: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  [VehicleStatus.SUSPENDED]: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export const VehicleStatusBadge: FC<{ status: VehicleStatus }> = ({ status }) => {
  const { t } = useTranslation("vehicles");
  return (
    <Badge variant="secondary" className={cn("rounded-sm", STATUS_CLASSES[status])}>
      {t(`status.${status}`)}
    </Badge>
  );
};
