import type { AxiosError } from "axios";

import type { ProblemDetail } from "@/api/generated/models";

// The BE answers errors as RFC 9457 problem details; `detail` is the human-readable part.
export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong, please try again.",
) => (error as AxiosError<ProblemDetail>)?.response?.data?.detail ?? fallback;
