import type { FC } from "react";

import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { IncomingInvitationResponse } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";
import { useRoleLabels } from "@/modules/common/utils/roles";

type PendingInvitationListProps = {
  email: string;
  invitations: IncomingInvitationResponse[];
  disabled: boolean;
  onAccept: (invitation: IncomingInvitationResponse) => void;
  onDecline: (invitation: IncomingInvitationResponse) => void;
};

export const PendingInvitationList: FC<PendingInvitationListProps> = ({
  email,
  invitations,
  disabled,
  onAccept,
  onDecline,
}) => {
  const { t } = useTranslation("organizations");
  const { formatRoles } = useRoleLabels();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("invitations.title")}</CardTitle>
        <CardDescription>{t("invitations.sentTo", { email })}</CardDescription>
      </CardHeader>
      <CardContent>
        {invitations.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            <Mail className="size-5" />
            {t("invitations.empty")}
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {invitations.map((invitation) => (
              <li key={invitation.id} className="flex flex-col gap-3 rounded-lg border p-3">
                <div className="flex flex-col">
                  <span className="font-medium">{invitation.organizationName}</span>
                  <span className="text-sm text-muted-foreground">
                    {t("invitations.invitedBy", {
                      name: invitation.invitedByName,
                      roles: formatRoles(invitation.roles),
                    })}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" disabled={disabled} onClick={() => onAccept(invitation)}>
                    {t("invitations.accept")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={disabled}
                    onClick={() => onDecline(invitation)}
                  >
                    {t("invitations.decline")}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
