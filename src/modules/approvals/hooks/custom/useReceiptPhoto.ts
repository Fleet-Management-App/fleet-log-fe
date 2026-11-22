import { useGetFuelReceipt } from "@/api/generated/hooks/trips/trips";
import type { TripResponse } from "@/api/generated/models";

/**
 * The fuel receipt photo of one trip, loaded on demand: the trip list only says whether there is a
 * receipt (hasReceipt), the photo itself is a separate request. The table row and the receipt
 * dialog share the cached response, so opening the dialog doesn't download the photo again.
 */
export const useReceiptPhoto = (trip: TripResponse | null) => {
  // Every new fuel entry has a receipt (BR-06), but entries logged before that rule may not
  const hasReceipt = trip?.fuel?.hasReceipt === true;
  const query = useGetFuelReceipt(trip?.id ?? "", { query: { enabled: hasReceipt } });

  return {
    hasReceipt,
    url: hasReceipt ? query.data?.receiptPhoto : undefined,
    isLoading: hasReceipt && query.isPending,
    isError: hasReceipt && query.isError,
  };
};
