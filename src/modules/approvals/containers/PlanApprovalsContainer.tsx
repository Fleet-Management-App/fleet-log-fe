import { type FC, useState } from "react";

import { useTranslation } from "react-i18next";

import { useDecideTripPlan } from "@/api/generated/hooks/trips/trips";
import type { TripResponse, VehicleResponse } from "@/api/generated/models";
import { formatDateTime } from "@/modules/common/utils/formatDate";

import { ActionErrorAlert } from "../components/ActionErrorAlert";
import { ApprovalsEmptyState } from "../components/ApprovalsEmptyState";
import { PlanApprovalsTable } from "../components/PlanApprovalsTable";
import { RejectDialog } from "../dialogs/RejectDialog";
import { useTripDecision } from "../hooks/custom/useTripDecision";
import { describeTrip } from "../utils/describeTrip";

type PlanApprovalsContainerProps = {
  // Trips in PLANNED, waiting for the plan decision
  trips: TripResponse[];
  vehiclesById: Map<string, VehicleResponse>;
};

export const PlanApprovalsContainer: FC<PlanApprovalsContainerProps> = ({
  trips,
  vehiclesById,
}) => {
  const { t } = useTranslation("approvals");
  const { mutateAsync: decidePlan } = useDecideTripPlan();
  const { pending, actionError, decideTrip } = useTripDecision("plan", decidePlan);
  const [rejecting, setRejecting] = useState<TripResponse | null>(null);

  const handleReject = async (trip: TripResponse, reason: string) => {
    await decideTrip(trip, false, reason);
    setRejecting(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {actionError && <ActionErrorAlert message={actionError} />}
      {trips.length === 0 ? (
        <ApprovalsEmptyState title={t("empty.plansTitle")} text={t("empty.plansText")} />
      ) : (
        <PlanApprovalsTable
          trips={trips}
          vehiclesById={vehiclesById}
          pending={pending}
          onApprove={(trip) => void decideTrip(trip, true)}
          onReject={setRejecting}
        />
      )}
      <RejectDialog
        trip={rejecting}
        title={t("rejectDialog.planTitle")}
        description={
          rejecting ? `${describeTrip(rejecting)} · ${formatDateTime(rejecting.dateTime)}` : ""
        }
        onClose={() => setRejecting(null)}
        onReject={handleReject}
      />
    </div>
  );
};
