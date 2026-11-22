import { i18n } from "@/config/i18n/i18n";

// Intl locale per UI language; formats follow the language the user picked, not the browser's.
const LOCALES = { en: "en-GB", cs: "cs-CZ" } as const;

const currentLocale = (): string =>
  LOCALES[(i18n.resolvedLanguage ?? "en") as keyof typeof LOCALES] ?? LOCALES.en;

/** 12 Nov 2026 / 12. 11. 2026 */
export const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat(currentLocale(), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));

/** 8:00 */
export const formatTime = (isoDate: string) =>
  new Intl.DateTimeFormat(currentLocale(), { hour: "numeric", minute: "2-digit" }).format(
    new Date(isoDate),
  );

/** 12 Nov 2026, 8:00 */
export const formatDateTime = (isoDate: string) => `${formatDate(isoDate)}, ${formatTime(isoDate)}`;

/** 12 345,5 in Czech, 12,345.5 in English */
export const formatNumber = (value: number, maximumFractionDigits = 2) =>
  new Intl.NumberFormat(currentLocale(), { maximumFractionDigits }).format(value);

/** Amounts in CZK, the only currency for now */
export const formatPrice = (value: number) =>
  new Intl.NumberFormat(currentLocale(), { style: "currency", currency: "CZK" }).format(value);
