import type { FC } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getGetMeQueryKey } from "@/api/generated/hooks/account/account";
import {
  useAcceptInvitation,
  useDeclineInvitation,
} from "@/api/generated/hooks/invitations/invitations";
import type { IncomingInvitationResponse } from "@/api/generated/models";
import { useStartSession } from "@/modules/auth/hooks/custom/useStartSession";
import { getErrorMessage } from "@/modules/common/utils/getErrorMessage";
import { useCurrentUser } from "@/security/useCurrentUser";

import { PendingInvitationList } from "../components/PendingInvitationList";

export const PendingInvitationsContainer: FC = () => {
  const { email, pendingInvitations } = useCurrentUser();
  const queryClient = useQueryClient();
  const { mutateAsync: accept, isPending: isAccepting } = useAcceptInvitation();
  const { mutateAsync: decline, isPending: isDeclining } = useDeclineInvitation();
  const startSession = useStartSession();

  const handleAccept = async (invitation: IncomingInvitationResponse) => {
    try {
      // Joining switches the user to the organization they just joined
      await startSession(await accept({ invitationId: invitation.id }));
      toast.success(`You joined ${invitation.organizationName}.`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDecline = async (invitation: IncomingInvitationResponse) => {
    try {
      await decline({ invitationId: invitation.id });
      await queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <PendingInvitationList
      email={email}
      invitations={pendingInvitations}
      disabled={isAccepting || isDeclining}
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  );
};
