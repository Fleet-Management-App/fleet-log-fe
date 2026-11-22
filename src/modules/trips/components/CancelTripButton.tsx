import { type FC, useState } from "react";

import { useTranslation } from "react-i18next";

import { Button } from "@/modules/common/components/ui/button";

type CancelTripButtonProps = {
  isCancelling: boolean;
  onConfirm: () => void;
};

/** Cancelling can't be undone, so the button asks once more inline before it calls the API. */
export const CancelTripButton: FC<CancelTripButtonProps> = ({ isCancelling, onConfirm }) => {
  const { t } = useTranslation("trips");
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isConfirming) {
    return (
      <Button variant="outline" size="lg" onClick={() => setIsConfirming(true)}>
        {t("detail.cancelTrip")}
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="group">
      <span className="text-sm text-muted-foreground">{t("detail.cancelConfirm")}</span>
      <Button
        variant="outline"
        size="lg"
        disabled={isCancelling}
        onClick={() => setIsConfirming(false)}
      >
        {t("detail.cancelConfirmNo")}
      </Button>
      <Button variant="destructive" size="lg" disabled={isCancelling} onClick={onConfirm}>
        {t("detail.cancelConfirmYes")}
      </Button>
    </div>
  );
};
