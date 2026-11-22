import type { FC } from "react";

import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/modules/common/components/ui/button";

import type { PendingDecision } from "../models/decision";

type DecisionActionsProps = {
  pending?: PendingDecision;
  onApprove: () => void;
  onReject: () => void;
};

// While the BE decides, the row's buttons give way to one disabled progress button
export const DecisionActions: FC<DecisionActionsProps> = ({ pending, onApprove, onReject }) => {
  const { t } = useTranslation();
  const { t: tApprovals } = useTranslation("approvals");

  if (pending) {
    return (
      <Button variant="secondary" disabled className="w-44">
        <Loader2 className="animate-spin" />
        {pending === "approve" ? tApprovals("pending.approving") : tApprovals("pending.rejecting")}
      </Button>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onReject}>
        {t("actions.reject")}
      </Button>
      <Button onClick={onApprove}>{t("actions.approve")}</Button>
    </div>
  );
};
