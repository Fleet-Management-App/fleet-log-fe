import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { Skeleton } from "@/modules/common/components/ui/skeleton";

const SKELETON_ROWS = 3;

export const ApprovalsLoading: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border" aria-busy="true">
      <span className="sr-only">{t("states.loading")}</span>
      <div className="border-b px-4 py-3">
        <Skeleton className="h-3 w-2/3" />
      </div>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <div key={index} className="flex items-center gap-6 border-b px-4 py-4 last:border-b-0">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-8 w-40" />
        </div>
      ))}
    </div>
  );
};
