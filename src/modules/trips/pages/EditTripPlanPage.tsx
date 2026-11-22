import type { FC } from "react";

import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PlanTripPageHeader } from "../components/PlanTripPageHeader";
import { EditTripPlanContainer } from "../containers/EditTripPlanContainer";

export const EditTripPlanPage: FC = () => {
  const { t } = useTranslation("tripPlan");
  const { tripId } = useParams({ from: "/_app/trips/$tripId/edit" });
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <PlanTripPageHeader title={t("edit.title")} subtitle={t("edit.subtitle")} />
      <EditTripPlanContainer tripId={tripId} />
    </div>
  );
};
