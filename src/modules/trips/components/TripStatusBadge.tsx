import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { TripStatus } from "@/api/generated/models";
import { Badge } from "@/modules/common/components/ui/badge";
import { cn } from "@/modules/common/lib/utils";

// Colours follow the Figma status chips: grey planned, blue approved, red rejected, green completed
const STATUS_CLASSES: Record<TripStatus, string> = {
  [TripStatus.PLANNED]: "bg-muted text-muted-foreground",
  [TripStatus.PLAN_APPROVED]: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  [TripStatus.PLAN_REJECTED]: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  [TripStatus.COMPLETED]: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  [TripStatus.CANCELLED]: "bg-muted text-muted-foreground line-through",
};

export const TripStatusBadge: FC<{ status: TripStatus; className?: string }> = ({
  status,
  className,
}) => {
  const { t } = useTranslation("trips");
  return (
    <Badge variant="secondary" className={cn("rounded-sm", STATUS_CLASSES[status], className)}>
      {t(`tripStatus.${status}`)}
    </Badge>
  );
};
