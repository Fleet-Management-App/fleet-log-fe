import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { FuelStatus } from "@/api/generated/models";
import { Badge } from "@/modules/common/components/ui/badge";
import { cn } from "@/modules/common/lib/utils";

// Fuel approval is independent of the trip status (BR-06), so it has its own chip
const STATUS_CLASSES: Record<FuelStatus, string> = {
  [FuelStatus.PENDING]: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  [FuelStatus.APPROVED]: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  [FuelStatus.REJECTED]: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export const FuelStatusBadge: FC<{ status: FuelStatus; className?: string }> = ({
  status,
  className,
}) => {
  const { t } = useTranslation("trips");
  return (
    <Badge variant="secondary" className={cn("rounded-sm", STATUS_CLASSES[status], className)}>
      {t(`fuelStatus.${status}`)}
    </Badge>
  );
};
