import type { ComponentProps, FC } from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/modules/common/components/ui/field";
import { Input } from "@/modules/common/components/ui/input";
import { useFieldContext } from "@/modules/common/components/form/formContext";

type UnitFieldProps = Omit<ComponentProps<typeof Input>, "value" | "onChange" | "onBlur"> & {
  label: string;
  unit: string;
  description?: string;
};

// A text input with its unit (km, l, Kč) shown inside on the right, as in the Figma log screens.
// Used inside `form.AppField`, which provides the field context.
export const UnitField: FC<UnitFieldProps> = ({ label, unit, description, ...inputProps }) => {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name} className="text-xs font-semibold tracking-wide uppercase">
        {label}
      </FieldLabel>
      <div className="relative">
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={isInvalid}
          className="pr-10"
          {...inputProps}
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
          {unit}
        </span>
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};
