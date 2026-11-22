import { type FC, useState } from "react";

import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { TripResponse } from "@/api/generated/models";
import { Skeleton } from "@/modules/common/components/ui/skeleton";

import { useReceiptPhoto } from "../hooks/custom/useReceiptPhoto";

type ReceiptThumbnailProps = {
  trip: TripResponse;
  alt: string;
  onOpen: () => void;
};

// Loads the row's receipt photo on its own; a failed request or an undecodable image falls back to
// a document icon, and the dialog still opens to say the receipt can't be shown
export const ReceiptThumbnail: FC<ReceiptThumbnailProps> = ({ trip, alt, onOpen }) => {
  const { t } = useTranslation("approvals");
  const { hasReceipt, url, isLoading, isError } = useReceiptPhoto(trip);
  const [brokenUrl, setBrokenUrl] = useState<string | null>(null);

  if (!hasReceipt)
    return <span className="text-sm text-muted-foreground">{t("receipt.none")}</span>;

  const renderPreview = () => {
    if (isLoading) return <Skeleton className="size-full rounded-none" />;
    if (isError || !url || brokenUrl === url)
      return <FileText className="size-4 text-muted-foreground" />;
    return (
      <img
        src={url}
        alt={alt}
        className="size-full object-cover"
        onError={() => setBrokenUrl(url)}
      />
    );
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex items-center gap-2 rounded-md text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-sm border bg-muted">
        {renderPreview()}
      </span>
      <span className="text-sm text-blue-600 group-hover:underline dark:text-blue-400">
        {t("receipt.show")}
      </span>
    </button>
  );
};
