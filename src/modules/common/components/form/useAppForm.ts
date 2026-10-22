import { createFormHook } from "@tanstack/react-form";

import { fieldContext, formContext } from "./formContext";
import { SubmitButton } from "./SubmitButton";
import { TextField } from "./TextField";

// App-wide form hook: register shared field components once, then every form uses
// `form.AppField` with e.g. `<field.TextField />` and `<form.SubmitButton />`.
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField },
  formComponents: { SubmitButton },
});
