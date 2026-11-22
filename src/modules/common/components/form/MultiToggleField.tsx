import type { FC } from "react";

import { Button } from "@/modules/common/components/ui/button";
import { FieldLegend, FieldSet } from "@/modules/common/components/ui/field";

import { useFieldContext } from "./formContext";
import { FormFieldError } from "./FormFieldError";

type MultiToggleFieldProps = {
  label: string;
  options: { value: string; label: string }[];
};

// Pick any number of options, e.g. the roles of a person who both manages the fleet and drives.
// Keeps the options' order in the value, whatever order they were clicked in.
export const MultiToggleField: FC<MultiToggleFieldProps> = ({ label, options }) => {
  const field = useFieldContext<string[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const selected = field.state.value;

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    field.handleChange(options.map((option) => option.value).filter((item) => next.includes(item)));
    field.handleBlur();
  };

  return (
    <FieldSet data-invalid={isInvalid}>
      <FieldLegend variant="label">{label}</FieldLegend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={isSelected ? "default" : "outline"}
              aria-pressed={isSelected}
              onClick={() => toggle(option.value)}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
      {isInvalid && <FormFieldError errors={field.state.meta.errors} />}
    </FieldSet>
  );
};
