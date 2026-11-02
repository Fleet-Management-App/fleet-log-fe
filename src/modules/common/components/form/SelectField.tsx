import type { FC } from "react";

import { Field, FieldError, FieldLabel } from "@/modules/common/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/common/components/ui/select";

import { useFieldContext } from "./formContext";

type SelectFieldProps = {
  label: string;
  options: { value: string; label: string }[];
};

export const SelectField: FC<SelectFieldProps> = ({ label, options }) => {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select value={field.state.value} onValueChange={field.handleChange}>
        <SelectTrigger id={field.name} aria-invalid={isInvalid} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};
