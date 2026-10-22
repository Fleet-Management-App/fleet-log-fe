import type { ComponentProps, FC } from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/modules/common/components/ui/field";
import { Input } from "@/modules/common/components/ui/input";

import { useFieldContext } from "./formContext";

type TextFieldProps = Omit<ComponentProps<typeof Input>, "value" | "onChange" | "onBlur"> & {
  label: string;
  description?: string;
};

export const TextField: FC<TextFieldProps> = ({ label, description, ...inputProps }) => {
  const field = useFieldContext<string>();
  // Errors only show once the user has left the field, so a half-typed value is not flagged.
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        {...inputProps}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};
