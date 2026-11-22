import type { AxiosError } from "axios";

import type { ProblemDetail } from "@/api/generated/models";
import { i18n } from "@/config/i18n/i18n";

// The BE answers errors as RFC 9457 problem details; `detail` is the human-readable part.
// The fallback is looked up on each call, so it follows the current language.
export const getErrorMessage = (error: unknown, fallback = i18n.t("states.actionError")) =>
  (error as AxiosError<ProblemDetail>)?.response?.data?.detail ?? fallback;
