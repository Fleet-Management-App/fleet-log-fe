import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { Button } from "@/modules/common/components/ui/button";

export const ApprovalsLoadError: FC<{ isRetrying: boolean; onRetry: () => void }> = ({
  isRetrying,
  onRetry,
}) => {
  const { t } = useTranslation();
  const { t: tApprovals } = useTranslation("approvals");

  return (
    <div
      role="alert"
      className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-lg border px-4 py-12 text-center"
    >
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{tApprovals("loadError.title")}</p>
        <p className="text-sm text-muted-foreground">{tApprovals("loadError.text")}</p>
      </div>
      <Button variant="outline" disabled={isRetrying} onClick={onRetry}>
        {t("actions.retry")}
      </Button>
    </div>
  );
};
