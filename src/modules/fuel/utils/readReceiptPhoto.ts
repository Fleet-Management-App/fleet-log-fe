import { formatNumber } from "@/modules/common/utils/formatDate";

import type { ReceiptPhoto } from "../models/receiptPhoto";

// The photo travels base64-encoded inside the JSON body (a third larger than the file), so keep it small
export const MAX_RECEIPT_PHOTO_BYTES = 5 * 1024 * 1024;

export type ReceiptPhotoError = "notImage" | "tooLarge" | "readError";

export type ReadReceiptPhotoResult =
  { photo: ReceiptPhoto; error?: never } | { photo?: never; error: ReceiptPhotoError };

/** Checks the picked file and reads it into a data URL; never throws */
export const readReceiptPhoto = (file: File): Promise<ReadReceiptPhotoResult> => {
  if (!file.type.startsWith("image/")) return Promise.resolve({ error: "notImage" });
  if (file.size > MAX_RECEIPT_PHOTO_BYTES) return Promise.resolve({ error: "tooLarge" });

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve({ photo: { dataUrl: reader.result, name: file.name, sizeBytes: file.size } })
        : resolve({ error: "readError" });
    reader.onerror = () => resolve({ error: "readError" });
    reader.readAsDataURL(file);
  });
};

/** 1,8 MB / 420 kB */
export const formatFileSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${formatNumber(bytes / 1024 / 1024, 1)} MB`
    : `${formatNumber(Math.max(1, Math.round(bytes / 1024)), 0)} kB`;
