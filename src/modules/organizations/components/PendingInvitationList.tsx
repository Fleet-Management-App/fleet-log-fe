import type { FC } from "react";

import { Mail } from "lucide-react";

import type { IncomingInvitationResponse } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";
import { ROLE_LABELS } from "@/modules/common/utils/roles";

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
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Invitations</CardTitle>
      <CardDescription>Sent to {email}</CardDescription>
    </CardHeader>
    <CardContent>
      {invitations.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
          <Mail className="size-5" />
          No invitations yet. Ask your Fleet Manager to invite this e-mail.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {invitations.map((invitation) => (
            <li key={invitation.id} className="flex flex-col gap-3 rounded-lg border p-3">
              <div className="flex flex-col">
                <span className="font-medium">{invitation.organizationName}</span>
                <span className="text-sm text-muted-foreground">
                  {invitation.invitedByName} invited you as {ROLE_LABELS[invitation.role]}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" disabled={disabled} onClick={() => onAccept(invitation)}>
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={disabled}
                  onClick={() => onDecline(invitation)}
                >
                  Decline
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);
