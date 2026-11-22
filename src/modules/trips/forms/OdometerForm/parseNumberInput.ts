// Inputs accept what people type in either language: "42 530", "38,5" or "38.5".
// \s also covers the no-break space Intl puts between thousands in Czech.
const normalizeNumberInput = (value: string) => value.replace(/\s/g, "").replace(",", ".");

/** Whole number of 0 or more, e.g. an odometer reading */
export const isWholeNumberInput = (value: string) => /^\d{1,9}$/.test(normalizeNumberInput(value));

/** Decimal number of 0 or more, with a comma or a dot */
export const isDecimalNumberInput = (value: string) =>
  /^\d{1,9}(\.\d{1,3})?$/.test(normalizeNumberInput(value));

export const parseNumberInput = (value: string) => Number(normalizeNumberInput(value));
