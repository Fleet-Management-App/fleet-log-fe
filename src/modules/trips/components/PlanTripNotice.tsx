import type { FC, ReactNode } from "react";

import { cn } from "@/modules/common/lib/utils";

type PlanTripNoticeVariant = "warning" | "error";

// Colours follow the Figma vignette boxes: amber for "ends soon", red for "expired" and errors
const VARIANT_CLASSES: Record<PlanTripNoticeVariant, string> = {
  warning:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  error:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
};

type PlanTripNoticeProps = {
  variant: PlanTripNoticeVariant;
  title: string;
  children?: ReactNode;
  className?: string;
};

export const PlanTripNotice: FC<PlanTripNoticeProps> = ({
  variant,
  title,
  children,
  className,
}) => (
  <div
    role={variant === "error" ? "alert" : "status"}
    className={cn("rounded-lg border px-3 py-2.5 text-sm", VARIANT_CLASSES[variant], className)}
  >
    <p className="font-semibold">{title}</p>
    {children && <div className="mt-0.5">{children}</div>}
  </div>
);
