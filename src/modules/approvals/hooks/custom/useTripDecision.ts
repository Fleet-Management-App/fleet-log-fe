import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getGetTripQueryKey, getListTripsQueryKey } from "@/api/generated/hooks/trips/trips";
import type { TripResponse } from "@/api/generated/models";

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
  },
  fuel: {
    approved: "toast.fuelApproved",
    rejected: "toast.fuelRejected",
    approveConflict: "errors.fuelConflict",
    rejectConflict: "errors.fuelConflict",
    approveFailed: "errors.fuelApproveFailed",
    rejectFailed: "errors.fuelRejectFailed",
  },
} as const;

// 409: no longer awaiting a decision (decided elsewhere, cancelled); 404: the trip is gone
const isStaleDecision = (error: unknown) =>
  isAxiosError(error) && (error.response?.status === 409 || error.response?.status === 404);

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
      const message = isStaleDecision(error)
        ? approved
          ? messages.approveConflict
          : messages.rejectConflict
        : approved
          ? messages.approveFailed
          : messages.rejectFailed;
      setActionError(t(message, { trip: label }));
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
