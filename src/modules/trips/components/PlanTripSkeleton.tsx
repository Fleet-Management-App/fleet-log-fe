import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { PlanTripCard } from "./PlanTripCard";

const SkeletonField: FC = () => (
  <div className="flex flex-col gap-2">
    <div className="h-3 w-16 rounded bg-muted" />
    <div className="h-8 rounded-lg bg-muted" />
  </div>
);

// Same shape as the form, so nothing shifts once the vehicles arrive
export const PlanTripSkeleton: FC = () => {
  const { t } = useTranslation();
  return (
    <PlanTripCard>
      <div role="status" aria-busy="true" className="flex animate-pulse flex-col gap-5">
        <span className="sr-only">{t("states.loading")}</span>
        <div className="grid gap-3 sm:grid-cols-2">
          <SkeletonField />
          <SkeletonField />
        </div>
        <SkeletonField />
        <div className="grid gap-3 sm:grid-cols-2">
          <SkeletonField />
          <SkeletonField />
        </div>
        <SkeletonField />
        <div className="h-8 rounded-lg bg-muted" />
      </div>
    </PlanTripCard>
  );
};
