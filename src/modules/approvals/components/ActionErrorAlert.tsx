import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { Alert, AlertDescription, AlertTitle } from "@/modules/common/components/ui/alert";

export const ActionErrorAlert: FC<{ message: string }> = ({ message }) => {
  const { t } = useTranslation("approvals");

  return (
    <Alert
      variant="destructive"
      className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
    >
      <AlertTitle className="font-semibold">{t("errors.title")}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
