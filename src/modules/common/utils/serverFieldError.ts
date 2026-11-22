import type { AnyFormApi } from "@tanstack/react-form";

import { getErrorField, getErrorMessage } from "./getErrorMessage";

/**
 * Shows a failed save's BE error on the form field it is about (ApiProblem.field, e.g.
 * `odometerEndKm`), as that field's onSubmit error. Returns the translated message when the error
 * names no field of this form, for the caller to show above the submit button instead.
 */
export const setServerFieldError = (form: AnyFormApi, error: unknown): string | undefined => {
  const message = getErrorMessage(error);
  const field = getErrorField(error);
  if (!field || !(field in form.state.values)) {
    return message;
  }
  form.setFieldMeta(field, (prev) => ({
    ...prev,
    isTouched: true,
    errorMap: { ...prev.errorMap, onSubmit: message },
  }));
  return undefined;
};

/**
 * Drops the BE's field errors once the driver changes any value. TanStack Form clears an onSubmit
 * error only on the field that changed, but the BE's error may be fixed in another field (an end
 * reading below the start is fixed by correcting the start), and an error left on a field keeps the
 * form from being submitted again. Meant for the form's `listeners.onChange`.
 */
export const clearServerFieldErrors = (form: AnyFormApi) => {
  for (const [field, meta] of Object.entries(form.state.fieldMeta)) {
    if (meta?.errorMap.onSubmit) {
      form.setFieldMeta(field, (prev) => ({
        ...prev,
        errorMap: { ...prev.errorMap, onSubmit: undefined },
      }));
    }
  }
};
