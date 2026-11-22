import { type FC, useState } from "react";

import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

type ReceiptThumbnailProps = {
  url?: string | null;
  alt: string;
  onOpen: () => void;
};

// receiptPhotoUrl is a data URL or a plain URL; a broken one falls back to a document icon
export const ReceiptThumbnail: FC<ReceiptThumbnailProps> = ({ url, alt, onOpen }) => {
  const { t } = useTranslation("approvals");
  const [isBroken, setIsBroken] = useState(false);

  if (!url) return <span className="text-sm text-muted-foreground">{t("receipt.none")}</span>;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex items-center gap-2 rounded-md text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-sm border bg-muted">
        {isBroken ? (
          <FileText className="size-4 text-muted-foreground" />
        ) : (
          <img
            src={url}
            alt={alt}
            className="size-full object-cover"
            onError={() => setIsBroken(true)}
          />
        )}
      </span>
      <span className="text-sm text-blue-600 group-hover:underline dark:text-blue-400">
        {t("receipt.show")}
      </span>
    </button>
  );
};
