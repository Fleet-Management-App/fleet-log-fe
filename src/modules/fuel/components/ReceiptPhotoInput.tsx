import { type FC, useId, useRef, useState } from "react";

import { CircleAlert, ImagePlus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/modules/common/components/ui/button";
import { cn } from "@/modules/common/lib/utils";

import type { ReceiptPhoto } from "../models/receiptPhoto";
import {
  formatFileSize,
  readReceiptPhoto,
  type ReceiptPhotoError,
} from "../utils/readReceiptPhoto";

type ReceiptPhotoInputProps = {
  id: string;
  value: ReceiptPhoto | null;
  isInvalid?: boolean;
  disabled?: boolean;
  onChange: (photo: ReceiptPhoto | null) => void;
  onBlur?: () => void;
};

type UploadFailure = { reason: ReceiptPhotoError; name: string; sizeBytes: number };

// Picks one receipt photo: an empty drop-zone button, then a preview with remove, or the
// "upload failed" state (Figma 8.4) when the file is not an image, too large or unreadable.
export const ReceiptPhotoInput: FC<ReceiptPhotoInputProps> = ({
  id,
  value,
  isInvalid,
  disabled,
  onChange,
  onBlur,
}) => {
  const { t } = useTranslation("tripLog");
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const [failure, setFailure] = useState<UploadFailure | null>(null);

  const openPicker = () => inputRef.current?.click();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const result = await readReceiptPhoto(file);
    if (result.photo) {
      setFailure(null);
      onChange(result.photo);
    } else {
      setFailure({ reason: result.error, name: file.name, sizeBytes: file.size });
      onChange(null);
    }
    onBlur?.();
  };

  const removePhoto = () => {
    setFailure(null);
    onChange(null);
    onBlur?.();
  };

  const fileInput = (
    <input
      ref={inputRef}
      id={id}
      type="file"
      accept="image/*"
      className="sr-only"
      tabIndex={-1}
      disabled={disabled}
      onChange={(e) => {
        void handleFile(e.target.files?.[0]);
        // Lets the same file be picked again after a failure or a remove
        e.target.value = "";
      }}
    />
  );

  if (failure) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-3"
      >
        {fileInput}
        <CircleAlert className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-sm">
          <span className="font-medium text-destructive">{t("receipt.uploadFailedTitle")}</span>
          <span className="break-words text-destructive/90">
            {t(`receipt.${failure.reason}`, {
              name: failure.name,
              size: formatFileSize(failure.sizeBytes),
            })}
          </span>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={openPicker} disabled={disabled}>
          {t("receipt.replace")}
        </Button>
      </div>
    );
  }

  if (value) {
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
        {fileInput}
        <img
          src={value.dataUrl}
          alt={t("receipt.previewAlt")}
          className="size-14 shrink-0 rounded-md border bg-background object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-sm">
          <span className="truncate">{value.name}</span>
          {value.sizeBytes !== undefined && (
            <span className="text-xs text-muted-foreground">{formatFileSize(value.sizeBytes)}</span>
          )}
        </div>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="text-destructive"
          onClick={removePhoto}
          disabled={disabled}
        >
          {t("receipt.remove")}
        </Button>
      </div>
    );
  }

  return (
    <>
      {fileInput}
      <button
        type="button"
        onClick={openPicker}
        disabled={disabled}
        aria-describedby={hintId}
        aria-invalid={isInvalid}
        className={cn(
          "flex w-full flex-col items-center gap-1 rounded-lg border border-dashed bg-muted/30 px-4 py-6 text-sm transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
          isInvalid && "border-destructive",
        )}
      >
        <ImagePlus className="size-5 text-muted-foreground" aria-hidden />
        <span className="font-medium">{t("receipt.choose")}</span>
        <span id={hintId} className="text-xs text-muted-foreground">
          {t("receipt.hint")}
        </span>
      </button>
    </>
  );
};
