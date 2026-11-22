import { type FC, useState } from "react";

import { useTranslation } from "react-i18next";

import type { TripResponse } from "@/api/generated/models";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/common/components/ui/dialog";
import { Skeleton } from "@/modules/common/components/ui/skeleton";
import { formatDate, formatNumber, formatPrice } from "@/modules/common/utils/formatDate";

import { DecisionActions } from "../components/DecisionActions";
import { useReceiptPhoto } from "../hooks/custom/useReceiptPhoto";
import type { PendingDecision } from "../models/decision";
import { describeTrip } from "../utils/describeTrip";

type ReceiptDialogProps = {
  trip: TripResponse | null;
  pending?: PendingDecision;
  onClose: () => void;
  onApprove: (trip: TripResponse) => void;
  onReject: (trip: TripResponse) => void;
};

// The receipt at full size next to what the driver typed in, so the two can be compared
export const ReceiptDialog: FC<ReceiptDialogProps> = ({
  trip,
  pending,
  onClose,
  onApprove,
  onReject,
}) => {
  const { t } = useTranslation("approvals");
  const [brokenUrl, setBrokenUrl] = useState<string | null>(null);
  // Usually already cached by the row's thumbnail
  const { hasReceipt, url, isLoading, isError } = useReceiptPhoto(trip);

  const renderReceipt = () => {
    if (!trip || !hasReceipt)
      return <p className="text-sm text-muted-foreground">{t("receipt.none")}</p>;
    if (isLoading) return <Skeleton className="h-64 w-48" />;
    if (isError || !url || brokenUrl === url)
      return <p className="text-sm text-muted-foreground">{t("receipt.unavailable")}</p>;
    return (
      <img
        src={url}
        alt={t("receipt.alt", { trip: describeTrip(trip) })}
        className="max-h-[60vh] max-w-full rounded-sm object-contain shadow-sm"
        onError={() => setBrokenUrl(url)}
      />
    );
  };

  return (
    <Dialog open={trip !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        {trip && (
          <>
            <DialogHeader>
              <DialogTitle>{t("receipt.title")}</DialogTitle>
              <DialogDescription>
                {`${describeTrip(trip)} · ${formatDate(trip.dateTime)}`}
              </DialogDescription>
            </DialogHeader>
            <div className="flex min-h-64 items-center justify-center rounded-md bg-muted p-4">
              {renderReceipt()}
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              {trip.fuel && (
                <div className="flex flex-col">
                  <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {t("receipt.loggedByDriver")}
                  </span>
                  <span className="font-semibold">
                    {`${t("liters", { value: formatNumber(trip.fuel.liters, 1) })} · ${formatPrice(trip.fuel.price)}`}
                  </span>
                </div>
              )}
              <div className="ml-auto">
                <DecisionActions
                  pending={pending}
                  onApprove={() => onApprove(trip)}
                  onReject={() => onReject(trip)}
                />
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
