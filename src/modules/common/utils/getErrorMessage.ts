import type { AxiosError } from "axios";

import type { ApiProblem, ApiProblemCode } from "@/api/generated/models";
import { i18n } from "@/config/i18n/i18n";

const getProblem = (error: unknown): ApiProblem | undefined =>
  (error as AxiosError<ApiProblem>)?.response?.data;

/** The BE's stable error code (ApiProblem.code), when the error has one. */
export const getErrorCode = (error: unknown): ApiProblemCode | undefined =>
  getProblem(error)?.code ?? undefined;

/** The request field the BE says the error is about, e.g. "plate" for VEHICLE_PLATE_TAKEN. */
export const getErrorField = (error: unknown): string | undefined =>
  getProblem(error)?.field ?? undefined;

// The BE answers with RFC 9457 problem details plus a stable `code`. The `detail` text is English
// only, so the message shown is the translation of the code (common:errors.<CODE>); an error without
// a known code falls back to [fallback]. Both are looked up on each call, so they follow the language.
export const getErrorMessage = (error: unknown, fallback = i18n.t("states.actionError")) => {
  const code = getErrorCode(error);
  return code && i18n.exists(`errors.${code}`) ? i18n.t(`errors.${code}`) : fallback;
};
