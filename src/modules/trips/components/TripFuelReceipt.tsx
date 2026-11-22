import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { useGetFuelReceipt } from "@/api/generated/hooks/trips/trips";
import { ApiProblemCode } from "@/api/generated/models";
import { getErrorCode } from "@/modules/common/utils/getErrorMessage";

// The receipt is whatever the driver sent: a data URL of the photo or a plain URL. Anything else
// (e.g. a javascript: URL) is not rendered.
const isSafeReceiptUrl = (url: string) => /^(https?:|data:image\/)/i.test(url);

// Browsers refuse to open a data: URL in a new tab, so it is opened as a blob URL instead
const openReceipt = async (url: string) => {
  if (!url.startsWith("data:")) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  const blob = await (await fetch(url)).blob();
  window.open(URL.createObjectURL(blob), "_blank", "noopener,noreferrer");
};

/**
 * The receipt photo of a trip's fuel entry. Trip responses only say whether there is one
 * (`hasReceipt`), so the photo — easily a few MB — is loaded here, only when it is shown.
 */
export const TripFuelReceipt: FC<{ tripId: string; hasReceipt: boolean }> = ({
  tripId,
  hasReceipt,
}) => {
  const { t } = useTranslation("trips");
  const receiptQuery = useGetFuelReceipt(tripId, {
    query: {
      enabled: hasReceipt,
      // No receipt behind the entry won't change on a retry
      retry: (failureCount, error) =>
        getErrorCode(error) !== ApiProblemCode.FUEL_RECEIPT_NOT_FOUND && failureCount < 3,
    },
  });

  if (!hasReceipt) {
    return <span className="text-muted-foreground">{t("detail.fuel.noReceipt")}</span>;
  }

  if (receiptQuery.isLoading) {
    return (
      <span className="flex items-center gap-2 text-muted-foreground" aria-busy="true">
        <span className="size-10 animate-pulse rounded border bg-muted" />
        {t("detail.fuel.loadingReceipt")}
      </span>
    );
  }

  const receiptUrl = receiptQuery.data?.receiptPhoto;
  if (!receiptUrl || !isSafeReceiptUrl(receiptUrl)) {
    return <span className="text-muted-foreground">{t("detail.fuel.receiptUnavailable")}</span>;
  }

  return (
    <button
      type="button"
      className="flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-400"
      onClick={() => openReceipt(receiptUrl)}
    >
      <img src={receiptUrl} alt="" className="size-10 rounded border object-cover" />
      {t("detail.fuel.showReceipt")}
    </button>
  );
};
