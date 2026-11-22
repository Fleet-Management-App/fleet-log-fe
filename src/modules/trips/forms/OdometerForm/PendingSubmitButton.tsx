import type { FC } from "react";

import { Loader2 } from "lucide-react";

import { useFormContext } from "@/modules/common/components/form/formContext";
import { Button } from "@/modules/common/components/ui/button";

type PendingSubmitButtonProps = {
  label: string;
  pendingLabel: string;
};

// Full-width submit of the log screens; while saving it shows a spinner and the pending label.
// Used inside `form.AppForm`, which provides the form context.
export const PendingSubmitButton: FC<PendingSubmitButtonProps> = ({ label, pendingLabel }) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" aria-hidden />}
          {isSubmitting ? pendingLabel : label}
        </Button>
      )}
    </form.Subscribe>
  );
};
