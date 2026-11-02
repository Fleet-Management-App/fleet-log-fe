import { useMe } from "@/api/generated/hooks/account/account";
import type { MeResponse } from "@/api/generated/models";

// The authenticated layout loads /api/me before rendering (see routes/_app.tsx), so inside it
// the data is always there; this hook just reads it and keeps it fresh.
export const useCurrentUser = (): MeResponse => {
  const { data } = useMe();
  if (!data) throw new Error("useCurrentUser used outside the authenticated layout");
  return data;
};
