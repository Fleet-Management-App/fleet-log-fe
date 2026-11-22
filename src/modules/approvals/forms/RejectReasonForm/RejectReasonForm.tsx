import type { FC } from "react";

import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useAppForm } from "@/modules/common/components/form/useAppForm";
import { Button } from "@/modules/common/components/ui/button";
import { DialogClose, DialogFooter } from "@/modules/common/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/modules/common/components/ui/field";
import { Textarea } from "@/modules/common/components/ui/textarea";

// Matches @Size(max = 500) on TripPlanDecisionRequest / TripFuelDecisionRequest
const REASON_MAX_LENGTH = 500;

type RejectReasonFormProps = {
  onSubmit: (reason: string) => Promise<void>;
};

// The BE accepts a rejection without a reason; the FE asks for one so the driver knows what to fix
export const RejectReasonForm: FC<RejectReasonFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const { t: tApprovals } = useTranslation("approvals");

  const rejectReasonSchema = z.object({
    reason: z
      .string()
      .trim()
      .min(1, tApprovals("rejectDialog.reasonRequired"))
      .max(REASON_MAX_LENGTH, tApprovals("rejectDialog.reasonTooLong", { max: REASON_MAX_LENGTH })),
  });

  const form = useAppForm({
    defaultValues: { reason: "" },
    validators: { onChange: rejectReasonSchema },
    onSubmit: ({ value }) => onSubmit(value.reason.trim()),
  });

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="reason">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel
                htmlFor={field.name}
                className="text-xs font-semibold tracking-wide uppercase"
              >
                {tApprovals("rejectDialog.reasonLabel")}
              </FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                rows={4}
                className="min-h-24"
                placeholder={tApprovals("rejectDialog.reasonPlaceholder")}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
              />
              <FieldDescription>{tApprovals("rejectDialog.reasonHint")}</FieldDescription>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>
      {/* Figma: plain buttons, no shaded footer band */}
      <DialogFooter className="mx-0 mb-0 border-t-0 bg-transparent p-0">
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                {t("actions.cancel")}
              </Button>
            </DialogClose>
          )}
        </form.Subscribe>
        <form.AppForm>
          <form.SubmitButton>{t("actions.reject")}</form.SubmitButton>
        </form.AppForm>
      </DialogFooter>
    </form>
  );
};
