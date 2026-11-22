import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { type TripResponse, TripStatus } from "@/api/generated/models";
import { cn } from "@/modules/common/lib/utils";

// Same colour per status as the status chip, so the banner and the chip read as one
const BANNER_CLASSES: Record<TripStatus, string> = {
  [TripStatus.PLANNED]: "border-border bg-muted/60 text-foreground",
  [TripStatus.PLAN_APPROVED]:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  [TripStatus.PLAN_REJECTED]:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  [TripStatus.COMPLETED]:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
  [TripStatus.CANCELLED]: "border-border bg-muted/60 text-muted-foreground",
};

/** What the trip's state means for the driver and what comes next. */
export const TripDetailBanner: FC<{ trip: TripResponse }> = ({ trip }) => {
  const { t } = useTranslation("trips");
  const { status, rejectionReason } = trip;

  return (
    <div
      role="status"
      className={cn("rounded-lg border px-4 py-3 text-sm", BANNER_CLASSES[status])}
    >
      <p className="font-semibold">{t(`detail.banner.${status}.title`)}</p>
      {status === TripStatus.PLAN_REJECTED && rejectionReason && (
        <p className="font-medium">{t("detail.reason", { reason: rejectionReason })}</p>
      )}
      <p>{t(`detail.banner.${status}.description`)}</p>
    </div>
  );
};
