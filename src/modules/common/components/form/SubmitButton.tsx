import type { FC, ReactNode } from "react";

import { Button } from "@/modules/common/components/ui/button";

import { useFormContext } from "./formContext";

export const SubmitButton: FC<{ children: ReactNode }> = ({ children }) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit || isSubmitting}>
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
};
