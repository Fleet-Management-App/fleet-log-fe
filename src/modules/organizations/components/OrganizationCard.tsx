import type { FC } from "react";

import { ChevronRight, Loader2 } from "lucide-react";

import type { MembershipResponse } from "@/api/generated/models";
import { useRoleLabels } from "@/modules/common/utils/roles";

type OrganizationCardProps = {
  membership: MembershipResponse;
  isOpening: boolean;
  disabled: boolean;
  onOpen: (membership: MembershipResponse) => void;
};

// One organization the user belongs to, with their roles in it; a click enters it
export const OrganizationCard: FC<OrganizationCardProps> = ({
  membership,
  isOpening,
  disabled,
  onOpen,
}) => {
  const { formatRoles } = useRoleLabels();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onOpen(membership)}
      className="flex w-full items-center gap-3 rounded-lg border bg-card px-4 py-3.5 text-left transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium sm:whitespace-normal">
          {membership.organizationName}
        </span>
        <span className="text-xs text-muted-foreground">{formatRoles(membership.roles)}</span>
      </div>
      {isOpening ? (
        <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" aria-hidden />
      ) : (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      )}
    </button>
  );
};
