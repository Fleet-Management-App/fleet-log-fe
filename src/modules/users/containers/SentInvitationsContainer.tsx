import type { FC } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getListInvitationsQueryKey,
  useListInvitations,
  useRevokeInvitation,
} from "@/api/generated/hooks/organization-members/organization-members";
import type { InvitationResponse } from "@/api/generated/models";
import { getErrorMessage } from "@/modules/common/utils/getErrorMessage";

import { SentInvitationsTable } from "../components/SentInvitationsTable";

export const SentInvitationsContainer: FC = () => {
  const queryClient = useQueryClient();
  const { data: invitations = [] } = useListInvitations();
  const { mutateAsync: revoke, isPending } = useRevokeInvitation();

  const handleRevoke = async (invitation: InvitationResponse) => {
    try {
      await revoke({ invitationId: invitation.id });
      toast.success(`Invitation for ${invitation.email} revoked.`);
      await queryClient.invalidateQueries({ queryKey: getListInvitationsQueryKey() });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (invitations.length === 0) return null;
  return (
    <SentInvitationsTable invitations={invitations} disabled={isPending} onRevoke={handleRevoke} />
  );
};
