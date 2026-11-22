import type { FC } from "react";

import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { IncomingInvitationResponse } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";
import { formatDate } from "@/modules/common/utils/formatDate";
import { useRoleLabels } from "@/modules/common/utils/roles";

type InvitationCardProps = {
  invitation: IncomingInvitationResponse;
  isAccepting: boolean;
  isDeclining: boolean;
  disabled: boolean;
  onAccept: (invitation: IncomingInvitationResponse) => void;
  onDecline: (invitation: IncomingInvitationResponse) => void;
};

// An invitation to an organization, waiting for the user's answer
export const InvitationCard: FC<InvitationCardProps> = ({
  invitation,
  isAccepting,
  isDeclining,
  disabled,
  onAccept,
  onDecline,
}) => {
  const { t } = useTranslation("organizations");
  const { formatRoles } = useRoleLabels();

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card px-4 py-3.5 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-medium">{invitation.organizationName}</span>
        <span className="text-xs text-muted-foreground" title={invitation.invitedByName}>
          {t("invitations.invitedOn", {
            roles: formatRoles(invitation.roles),
            date: formatDate(invitation.createdAt),
          })}
        </span>
      </div>
      <div className="flex gap-2 sm:shrink-0">
        <Button variant="ghost" disabled={disabled} onClick={() => onDecline(invitation)}>
          {isDeclining && <Loader2 className="animate-spin" aria-hidden />}
          {t("invitations.decline")}
        </Button>
        <Button
          className="flex-1 sm:flex-none"
          disabled={disabled}
          onClick={() => onAccept(invitation)}
        >
          {isAccepting && <Loader2 className="animate-spin" aria-hidden />}
          {isAccepting ? t("invitations.accepting") : t("invitations.accept")}
        </Button>
      </div>
    </div>
  );
};
