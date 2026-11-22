import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getGetTripQueryKey, getListTripsQueryKey } from "@/api/generated/hooks/trips/trips";
import { ApiProblemCode, type TripResponse } from "@/api/generated/models";
import { getErrorCode, getErrorMessage } from "@/modules/common/utils/getErrorMessage";

import type { DecisionKind, PendingDecision } from "../../models/decision";
import { describeTrip } from "../../utils/describeTrip";

type DecisionRequest = { approved: boolean; rejectionReason?: string | null };
type DecideMutation = (variables: { tripId: string; data: DecisionRequest }) => Promise<unknown>;

const MESSAGES = {
  plan: {
    approved: "toast.planApproved",
    rejected: "toast.planRejected",
    approveConflict: "errors.planConflictApprove",
    rejectConflict: "errors.planConflictReject",
    approveFailed: "errors.planApproveFailed",
    rejectFailed: "errors.planRejectFailed",
    approveRefused: "errors.planApproveRefused",
    rejectRefused: "errors.planRejectRefused",
  },
  fuel: {
    approved: "toast.fuelApproved",
    rejected: "toast.fuelRejected",
    approveConflict: "errors.fuelConflict",
    rejectConflict: "errors.fuelConflict",
    approveFailed: "errors.fuelApproveFailed",
    rejectFailed: "errors.fuelRejectFailed",
    approveRefused: "errors.fuelApproveRefused",
    rejectRefused: "errors.fuelRejectRefused",
  },
} as const;

// Codes meaning the row no longer awaits this decision: decided by another manager, cancelled by
// the driver, or the trip is gone. The refetch then drops the row, so the banner says so.
const STALE_CODES: Record<DecisionKind, ReadonlySet<ApiProblemCode>> = {
  plan: new Set([ApiProblemCode.TRIP_NOT_PLANNED, ApiProblemCode.TRIP_NOT_FOUND]),
  fuel: new Set([
    ApiProblemCode.FUEL_ENTRY_NOT_PENDING,
    ApiProblemCode.NO_FUEL_ENTRY,
    ApiProblemCode.TRIP_NOT_FOUND,
  ]),
};

/**
 * Runs approve/reject decisions of one kind: tracks which rows are waiting for the BE, refreshes
 * the list afterwards (also after a failure, so a decision made elsewhere disappears) and keeps the
 * last failure for the inline error banner.
 */
export const useTripDecision = (kind: DecisionKind, decide: DecideMutation) => {
  const { t } = useTranslation("approvals");
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<Record<string, PendingDecision>>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const messages = MESSAGES[kind];

  const describeFailure = (error: unknown, approved: boolean, label: string) => {
    const code = getErrorCode(error);
    if (code && STALE_CODES[kind].has(code))
      return t(approved ? messages.approveConflict : messages.rejectConflict, { trip: label });
    // A refusal the BE explains, e.g. VEHICLE_UNAVAILABLE when the vehicle got suspended (BR-01)
    const reason = getErrorMessage(error, "");
    if (reason)
      return t(approved ? messages.approveRefused : messages.rejectRefused, {
        trip: label,
        reason,
      });
    return t(approved ? messages.approveFailed : messages.rejectFailed, { trip: label });
  };

  const decideTrip = async (trip: TripResponse, approved: boolean, rejectionReason?: string) => {
    const label = describeTrip(trip);
    setActionError(null);
    setPending((current) => ({ ...current, [trip.id]: approved ? "approve" : "reject" }));
    try {
      await decide({
        tripId: trip.id,
        data: { approved, rejectionReason: approved ? null : rejectionReason },
      });
      toast.success(t(approved ? messages.approved : messages.rejected, { trip: label }));
    } catch (error) {
      setActionError(describeFailure(error, approved, label));
    } finally {
      // Refetch before releasing the row, so a decided row leaves instead of flashing its buttons
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getGetTripQueryKey(trip.id) }),
      ]);
      setPending((current) => {
        const next = { ...current };
        delete next[trip.id];
        return next;
      });
    }
  };

  return { pending, actionError, decideTrip };
};
