/** A receipt photo picked on the fuel form, kept as the data URL the BE stores as given */
export type ReceiptPhoto = {
  dataUrl: string;
  name: string;
  // Unknown for a photo that was sent before (a rejected entry being resubmitted)
  sizeBytes?: number;
};
