import type { FC } from "react";

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
import { ROLE_LABELS } from "@/modules/common/utils/roles";

type SentInvitationsTableProps = {
  invitations: InvitationResponse[];
  disabled: boolean;
  onRevoke: (invitation: InvitationResponse) => void;
};

export const SentInvitationsTable: FC<SentInvitationsTableProps> = ({
  invitations,
  disabled,
  onRevoke,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Waiting for an answer ({invitations.length})</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>E-mail</TableHead>
            <TableHead className="w-44">Role</TableHead>
            <TableHead className="w-28">Sent</TableHead>
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
                    by {invitation.invitedByName}
                  </span>
                </div>
              </TableCell>
              <TableCell>{ROLE_LABELS[invitation.role]}</TableCell>
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
                  Revoke
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
