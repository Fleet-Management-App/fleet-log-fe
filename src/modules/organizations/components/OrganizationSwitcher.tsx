import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

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
import { useRoleLabels } from "@/modules/common/utils/roles";

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
}) => {
  const { t } = useTranslation("organizations");
  const { formatRoles } = useRoleLabels();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled} className="max-w-64">
          <Building2 />
          <span className="truncate">
            {active?.organizationName ?? t("switcher.noOrganization")}
          </span>
          {pendingInvitationCount > 0 && <Badge>{pendingInvitationCount}</Badge>}
          <ChevronsUpDown className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>{t("switcher.yourOrganizations")}</DropdownMenuLabel>
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
                <span className="text-xs text-muted-foreground">
                  {formatRoles(membership.roles)}
                </span>
              </div>
              {isActive && <Check />}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/welcome">
            <Plus />
            {t("createOrJoin")}
            {pendingInvitationCount > 0 && (
              <Badge className="ml-auto">{pendingInvitationCount}</Badge>
            )}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
