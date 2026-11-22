import type { FC } from "react";

import type { TripResponse } from "@/api/generated/models";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/common/components/ui/dialog";

import { RejectReasonForm } from "../forms/RejectReasonForm/RejectReasonForm";

type RejectDialogProps = {
  trip: TripResponse | null;
  title: string;
  // Who, where and when, so the manager sees what they are rejecting
  description: string;
  onClose: () => void;
  onReject: (trip: TripResponse, reason: string) => Promise<void>;
};

export const RejectDialog: FC<RejectDialogProps> = ({
  trip,
  title,
  description,
  onClose,
  onReject,
}) => (
  <Dialog open={trip !== null} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      {trip && <RejectReasonForm key={trip.id} onSubmit={(reason) => onReject(trip, reason)} />}
    </DialogContent>
  </Dialog>
);
