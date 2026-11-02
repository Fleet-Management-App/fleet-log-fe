import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";

import type { MembershipResponse } from "@/api/generated/models";
import { Badge } from "@/modules/common/components/ui/badge";
import { Button } from "@/modules/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/common/components/ui/dropdown-menu";
import { ROLE_LABELS } from "@/modules/common/utils/roles";

type OrganizationSwitcherProps = {
  active?: MembershipResponse;
  memberships: MembershipResponse[];
  pendingInvitationCount: number;
  disabled: boolean;
  onSwitch: (organizationId: string) => void;
};

// One account, many organizations: the role shown is the one the user has in each of them.
export const OrganizationSwitcher: FC<OrganizationSwitcherProps> = ({
  active,
  memberships,
  pendingInvitationCount,
  disabled,
  onSwitch,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" disabled={disabled} className="max-w-64">
        <Building2 />
        <span className="truncate">{active?.organizationName ?? "No organization"}</span>
        {pendingInvitationCount > 0 && <Badge>{pendingInvitationCount}</Badge>}
        <ChevronsUpDown className="text-muted-foreground" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-72">
      <DropdownMenuLabel>Your organizations</DropdownMenuLabel>
      {memberships.map((membership) => {
        const isActive = membership.organizationId === active?.organizationId;
        return (
          <DropdownMenuItem
            key={membership.organizationId}
            disabled={isActive}
            onSelect={() => onSwitch(membership.organizationId)}
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate">{membership.organizationName}</span>
              <span className="text-xs text-muted-foreground">{ROLE_LABELS[membership.role]}</span>
            </div>
            {isActive && <Check />}
          </DropdownMenuItem>
        );
      })}
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link to="/welcome">
          <Plus />
          Create or join an organization
          {pendingInvitationCount > 0 && (
            <Badge className="ml-auto">{pendingInvitationCount}</Badge>
          )}
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
