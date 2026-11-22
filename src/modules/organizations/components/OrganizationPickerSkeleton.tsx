import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { Skeleton } from "@/modules/common/components/ui/skeleton";

const SKELETON_CARDS = 3;

export const OrganizationPickerSkeleton: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3" aria-busy="true">
      <span className="sr-only">{t("states.loading")}</span>
      {Array.from({ length: SKELETON_CARDS }, (_, index) => (
        <div key={index} className="flex flex-col gap-2 rounded-lg border px-4 py-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
};
