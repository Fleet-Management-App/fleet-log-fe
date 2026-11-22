import { type FC, useState } from "react";

import { useTranslation } from "react-i18next";

import { useDecideFuel } from "@/api/generated/hooks/trips/trips";
import type { TripResponse, VehicleResponse } from "@/api/generated/models";
import { formatDate } from "@/modules/common/utils/formatDate";

import { ActionErrorAlert } from "../components/ActionErrorAlert";
import { ApprovalsEmptyState } from "../components/ApprovalsEmptyState";
import { FuelApprovalsTable } from "../components/FuelApprovalsTable";
import { ReceiptDialog } from "../dialogs/ReceiptDialog";
import { RejectDialog } from "../dialogs/RejectDialog";
import { useTripDecision } from "../hooks/custom/useTripDecision";
import { describeTrip } from "../utils/describeTrip";

type FuelApprovalsContainerProps = {
  // Trips whose fuel entry is PENDING, whatever the trip's own status (BR-06)
  trips: TripResponse[];
  vehiclesById: Map<string, VehicleResponse>;
};

export const FuelApprovalsContainer: FC<FuelApprovalsContainerProps> = ({
  trips,
  vehiclesById,
}) => {
  const { t } = useTranslation("approvals");
  const { mutateAsync: decideFuel } = useDecideFuel();
  const { pending, actionError, decideTrip } = useTripDecision("fuel", decideFuel);
  const [viewingReceipt, setViewingReceipt] = useState<TripResponse | null>(null);
  const [rejecting, setRejecting] = useState<TripResponse | null>(null);

  const handleApprove = (trip: TripResponse) => {
    setViewingReceipt(null);
    void decideTrip(trip, true);
  };

  const handleOpenReject = (trip: TripResponse) => {
    setViewingReceipt(null);
    setRejecting(trip);
  };

  const handleReject = async (trip: TripResponse, reason: string) => {
    await decideTrip(trip, false, reason);
    setRejecting(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {actionError && <ActionErrorAlert message={actionError} />}
      {trips.length === 0 ? (
        <ApprovalsEmptyState title={t("empty.fuelTitle")} text={t("empty.fuelText")} />
      ) : (
        <FuelApprovalsTable
          trips={trips}
          vehiclesById={vehiclesById}
          pending={pending}
          onApprove={handleApprove}
          onReject={handleOpenReject}
          onShowReceipt={setViewingReceipt}
        />
      )}
      <ReceiptDialog
        trip={viewingReceipt}
        pending={viewingReceipt ? pending[viewingReceipt.id] : undefined}
        onClose={() => setViewingReceipt(null)}
        onApprove={handleApprove}
        onReject={handleOpenReject}
      />
      <RejectDialog
        trip={rejecting}
        title={t("rejectDialog.fuelTitle")}
        description={
          rejecting ? `${describeTrip(rejecting)} · ${formatDate(rejecting.dateTime)}` : ""
        }
        onClose={() => setRejecting(null)}
        onReject={handleReject}
      />
    </div>
  );
};
