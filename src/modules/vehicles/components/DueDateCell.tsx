import type { FC } from "react";

import { CircleAlert, TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/modules/common/lib/utils";
import { formatDate } from "@/modules/common/utils/formatDate";

import { getDueDateState } from "../utils/getDueDateState";

// The state is spelled out under the date, so it doesn't rely on the colour alone
export const DueDateCell: FC<{ dueDate?: string | null }> = ({ dueDate }) => {
  const { t } = useTranslation("vehicles");

  if (!dueDate) return <span className="text-muted-foreground">—</span>;

  const state = getDueDateState(dueDate);
  if (state.kind === "ok") return <span>{formatDate(dueDate)}</span>;

  const isExpired = state.kind === "expired";
  const Icon = isExpired ? CircleAlert : TriangleAlert;
  let note: string;
  if (isExpired) note = t("dueDate.overdue", { count: state.days });
  else if (state.days === 0) note = t("dueDate.dueToday");
  else note = t("dueDate.dueIn", { count: state.days });

  return (
    <div
      className={cn(
        "flex flex-col",
        isExpired ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400",
      )}
    >
      <span className="flex items-center gap-1 font-medium">
        <Icon className="size-3.5 shrink-0" aria-hidden />
        {formatDate(dueDate)}
      </span>
      <span className="text-xs">{note}</span>
    </div>
  );
};
