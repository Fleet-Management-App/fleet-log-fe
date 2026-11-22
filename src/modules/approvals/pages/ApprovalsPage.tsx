import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { ApprovalsContainer } from "../containers/ApprovalsContainer";

export const ApprovalsPage: FC = () => {
  const { t } = useTranslation("approvals");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <ApprovalsContainer />
    </div>
  );
};
