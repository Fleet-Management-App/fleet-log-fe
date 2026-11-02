import type { FC } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { getGetMeQueryKey } from "@/api/generated/hooks/account/account";
import {
  getListMembersQueryKey,
  useChangeMemberRole,
  useListMembers,
  useRemoveMember,
} from "@/api/generated/hooks/organization-members/organization-members";
import type { MemberResponse, Role } from "@/api/generated/models";
import { getErrorMessage } from "@/modules/common/utils/getErrorMessage";
import { ROLE_LABELS } from "@/modules/common/utils/roles";
import { useCurrentUser } from "@/security/useCurrentUser";

import { MembersTable } from "../components/MembersTable";

export const MembersContainer: FC = () => {
  const { id: currentUserId } = useCurrentUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: members = [], isLoading } = useListMembers();
  const { mutateAsync: changeRole, isPending: isChangingRole } = useChangeMemberRole();
  const { mutateAsync: removeMember, isPending: isRemoving } = useRemoveMember();

  const refresh = () => queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() });

  // Changing your own role takes the Fleet Manager rights away, so leave this page
  const afterOwnChange = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    await navigate({ to: "/" });
  };

  const handleRoleChange = async (member: MemberResponse, role: Role) => {
    try {
      await changeRole({ userId: member.userId, data: { role } });
      toast.success(`${member.fullName} is now ${ROLE_LABELS[role]}.`);
      if (member.userId === currentUserId) await afterOwnChange();
      else await refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleRemove = async (member: MemberResponse) => {
    try {
      await removeMember({ userId: member.userId });
      toast.success(`${member.fullName} no longer has access.`);
      if (member.userId === currentUserId) await afterOwnChange();
      else await refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <MembersTable
      members={members}
      currentUserId={currentUserId}
      isLoading={isLoading}
      disabled={isChangingRole || isRemoving}
      onRoleChange={handleRoleChange}
      onRemove={handleRemove}
    />
  );
};
