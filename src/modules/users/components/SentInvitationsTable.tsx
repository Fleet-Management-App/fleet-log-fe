import type { FC } from "react";

import { useTranslation } from "react-i18next";

import type { InvitationResponse } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/common/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/common/components/ui/table";
import { formatDate } from "@/modules/common/utils/formatDate";
import { useRoleLabels } from "@/modules/common/utils/roles";

type SentInvitationsTableProps = {
  invitations: InvitationResponse[];
  disabled: boolean;
  onRevoke: (invitation: InvitationResponse) => void;
};

export const SentInvitationsTable: FC<SentInvitationsTableProps> = ({
  invitations,
  disabled,
  onRevoke,
}) => {
  const { t } = useTranslation("users");
  const { formatRoles } = useRoleLabels();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("sentInvitations.title", { count: invitations.length })}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("sentInvitations.email")}</TableHead>
              <TableHead className="w-44">{t("sentInvitations.roles")}</TableHead>
              <TableHead className="w-28">{t("sentInvitations.sent")}</TableHead>
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{invitation.email}</span>
                    <span className="text-xs text-muted-foreground">
                      {t("sentInvitations.invitedBy", { name: invitation.invitedByName })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{formatRoles(invitation.roles)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(invitation.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={disabled}
                    onClick={() => onRevoke(invitation)}
                  >
                    {t("sentInvitations.revoke")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
