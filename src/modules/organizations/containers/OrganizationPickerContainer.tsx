import { type FC, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getGetMeQueryKey, useGetMe } from "@/api/generated/hooks/account/account";
import { useSwitchOrganization } from "@/api/generated/hooks/auth/auth";
import {
  useAcceptInvitation,
  useDeclineInvitation,
} from "@/api/generated/hooks/invitations/invitations";
import type { IncomingInvitationResponse, MembershipResponse } from "@/api/generated/models";
import { useStartSession } from "@/modules/auth/hooks/custom/useStartSession";
import { ServerErrorAlert } from "@/modules/common/components/form/ServerErrorAlert";
import { Button } from "@/modules/common/components/ui/button";
import { getErrorMessage } from "@/modules/common/utils/getErrorMessage";

import { InvitationCard } from "../components/InvitationCard";
import { OrganizationCard } from "../components/OrganizationCard";
import { OrganizationPickerSkeleton } from "../components/OrganizationPickerSkeleton";
import { PickerMessageCard } from "../components/PickerMessageCard";
import { PickerPageHeader } from "../components/PickerPageHeader";
import { PickerSectionHeading } from "../components/PickerSectionHeading";

// What the user just clicked; one thing at a time, the rest of the page waits for it
type PendingAction = { kind: "open" | "accept" | "decline"; id: string };

export const OrganizationPickerContainer: FC = () => {
  const { t } = useTranslation(["organizations", "common"]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const startSession = useStartSession();
  // Always reloaded when the picker opens: an invitation may have arrived since the last visit
  const meQuery = useGetMe({ query: { refetchOnMount: "always" } });
  const { mutateAsync: switchOrganization } = useSwitchOrganization();
  const { mutateAsync: acceptInvitation } = useAcceptInvitation();
  const { mutateAsync: declineInvitation } = useDeclineInvitation();
  const [pending, setPending] = useState<PendingAction>();
  const [actionError, setActionError] = useState<string>();

  const run = async (action: PendingAction, task: () => Promise<void>) => {
    setPending(action);
    setActionError(undefined);
    try {
      await task();
    } catch (error) {
      setActionError(getErrorMessage(error));
      // E.g. an invitation withdrawn in the meantime: reload, so it drops off the list
      await queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    } finally {
      setPending(undefined);
    }
  };

  const handleOpen = (membership: MembershipResponse) => {
    // The token already belongs to the active organization; no switch needed
    if (membership.organizationId === meQuery.data?.activeOrganization?.organizationId) {
      void navigate({ to: "/" });
      return;
    }
    void run({ kind: "open", id: membership.organizationId }, async () => {
      await startSession(
        await switchOrganization({ data: { organizationId: membership.organizationId } }),
      );
    });
  };

  const handleAccept = (invitation: IncomingInvitationResponse) =>
    void run({ kind: "accept", id: invitation.id }, async () => {
      // Joining switches the user to the organization they just joined
      const session = await acceptInvitation({ invitationId: invitation.id });
      toast.success(t("invitations.joined", { organization: invitation.organizationName }));
      await startSession(session);
    });

  const handleDecline = (invitation: IncomingInvitationResponse) =>
    void run({ kind: "decline", id: invitation.id }, async () => {
      await declineInvitation({ invitationId: invitation.id });
      await queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    });

  const isPending = (kind: PendingAction["kind"], id: string) =>
    pending?.kind === kind && pending.id === id;

  const pickerHeader = (
    <PickerPageHeader title={t("picker.title")} description={t("picker.description")} />
  );

  if (meQuery.isError) {
    return (
      <div className="flex flex-col gap-6">
        {pickerHeader}
        <PickerMessageCard
          title={t("picker.loadError.title")}
          description={t("picker.loadError.description")}
          action={
            <Button
              variant="outline"
              disabled={meQuery.isFetching}
              onClick={() => void meQuery.refetch()}
            >
              {t("common:actions.retry")}
            </Button>
          }
        />
      </div>
    );
  }

  const createNewButton = (
    <Button variant="outline" className="w-full" asChild>
      <Link to="/organizations/new">{t("picker.createNew")}</Link>
    </Button>
  );

  if (!meQuery.isFetchedAfterMount || !meQuery.data) {
    return (
      <div className="flex flex-col gap-6">
        {pickerHeader}
        <OrganizationPickerSkeleton />
        {createNewButton}
      </div>
    );
  }

  const { memberships, pendingInvitations } = meQuery.data;

  if (memberships.length === 0 && pendingInvitations.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PickerPageHeader
          title={t("picker.empty.title")}
          description={t("picker.empty.description")}
        />
        <PickerMessageCard
          title={t("picker.empty.heading")}
          description={t("picker.empty.text")}
          action={
            <Button asChild>
              <Link to="/organizations/new">{t("picker.empty.create")}</Link>
            </Button>
          }
        />
      </div>
    );
  }

  // Section headings only matter when there are both kinds of cards on the page
  const hasInvitations = pendingInvitations.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {pickerHeader}
      <ServerErrorAlert title={t("picker.errorTitle")} message={actionError} />
      {hasInvitations && (
        <section className="flex flex-col gap-3">
          <PickerSectionHeading>{t("picker.invitationsHeading")}</PickerSectionHeading>
          {pendingInvitations.map((invitation) => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              isAccepting={isPending("accept", invitation.id)}
              isDeclining={isPending("decline", invitation.id)}
              disabled={pending !== undefined}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))}
        </section>
      )}
      {memberships.length > 0 && (
        <section className="flex flex-col gap-3">
          {hasInvitations && (
            <PickerSectionHeading>{t("picker.organizationsHeading")}</PickerSectionHeading>
          )}
          {memberships.map((membership) => (
            <OrganizationCard
              key={membership.organizationId}
              membership={membership}
              isOpening={isPending("open", membership.organizationId)}
              disabled={pending !== undefined}
              onOpen={handleOpen}
            />
          ))}
        </section>
      )}
      {createNewButton}
    </div>
  );
};
