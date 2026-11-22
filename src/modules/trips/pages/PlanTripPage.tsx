import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { PlanTripPageHeader } from "../components/PlanTripPageHeader";
import { PlanTripContainer } from "../containers/PlanTripContainer";

export const PlanTripPage: FC = () => {
  const { t } = useTranslation("tripPlan");
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <PlanTripPageHeader title={t("plan.title")} subtitle={t("plan.subtitle")} />
      <PlanTripContainer />
    </div>
  );
};
