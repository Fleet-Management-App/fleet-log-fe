import type { FC, ReactNode } from "react";

import { CircleAlert, Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/modules/common/components/ui/alert";
import { cn } from "@/modules/common/lib/utils";

type LogTripNoticeProps = {
  title: string;
  children?: ReactNode;
  variant?: "info" | "warning" | "destructive";
  action?: ReactNode;
};

const VARIANT_CLASSES = {
  info: "bg-muted/40",
  warning:
    "border-amber-200 bg-amber-50 text-amber-800 *:data-[slot=alert-description]:text-amber-800/90 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200 dark:*:data-[slot=alert-description]:text-amber-200/90",
  destructive: "border-destructive/30 bg-destructive/5",
} as const;

// Shown instead of (or above) a log form when the trip's state doesn't allow it, or why it was rejected
export const LogTripNotice: FC<LogTripNoticeProps> = ({
  title,
  children,
  variant = "info",
  action,
}) => (
  <Alert
    variant={variant === "destructive" ? "destructive" : "default"}
    className={cn(VARIANT_CLASSES[variant])}
  >
    {variant === "info" ? <Info /> : <CircleAlert />}
    <AlertTitle>{title}</AlertTitle>
    {(children || action) && (
      <AlertDescription className="flex flex-col items-start gap-2">
        {children}
        {action}
      </AlertDescription>
    )}
  </Alert>
);
