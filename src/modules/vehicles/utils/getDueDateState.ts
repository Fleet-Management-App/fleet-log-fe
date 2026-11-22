// How far ahead an STK / insurance / vignette due date starts being flagged
export const DUE_SOON_DAYS = 30;

export type DueDateState =
  { kind: "ok"; days: number } | { kind: "soon"; days: number } | { kind: "expired"; days: number };

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Classifies a `YYYY-MM-DD` due date against today's local date. `days` is how many days are
 * left (soon / ok) or how many have passed (expired). A date due today is still valid that day.
 */
export const getDueDateState = (dueDate: string, today = new Date()): DueDateState => {
  const [year, month, day] = dueDate.split("-").map(Number);
  // Both sides as UTC midnights, so daylight-saving changes can't shift the difference
  const due = Date.UTC(year, month - 1, day);
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const days = Math.round((due - now) / DAY_MS);

  if (days < 0) return { kind: "expired", days: -days };
  if (days <= DUE_SOON_DAYS) return { kind: "soon", days };
  return { kind: "ok", days };
};
