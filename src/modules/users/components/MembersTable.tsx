import { type FC, useState } from "react";

import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { MemberResponse, Role } from "@/api/generated/models";
import { Badge } from "@/modules/common/components/ui/badge";
import { Button } from "@/modules/common/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/common/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/modules/common/components/ui/dropdown-menu";
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

type MembersTableProps = {
  members: MemberResponse[];
  currentUserId: string;
  isLoading: boolean;
  disabled: boolean;
  onRolesChange: (member: MemberResponse, roles: Role[]) => void;
  onRemove: (member: MemberResponse) => void;
};

export const MembersTable: FC<MembersTableProps> = ({
  members,
  currentUserId,
  isLoading,
  disabled,
  onRolesChange,
  onRemove,
}) => {
  // Removing asks once more inline instead of a browser confirm dialog
  const [confirmingUserId, setConfirmingUserId] = useState<string | null>(null);
  const { t } = useTranslation(["users", "common"]);
  const { formatRoles, roleOptions } = useRoleLabels();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("members.title", { count: members.length })}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("members.name")}</TableHead>
              <TableHead className="w-52">{t("members.roles")}</TableHead>
              <TableHead className="w-28">{t("members.joined")}</TableHead>
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  {t("common:states.loading")}
                </TableCell>
              </TableRow>
            )}
            {members.map((member) => (
              <TableRow key={member.userId}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2 font-medium">
                      {member.fullName}
                      {member.userId === currentUserId && (
                        <Badge variant="secondary">{t("members.you")}</Badge>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">{member.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {/* A member can hold several roles; the last one can't be unticked */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={disabled}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full justify-between font-normal"
                        aria-label={t("members.rolesOf", { name: member.fullName })}
                      >
                        <span className="truncate">{formatRoles(member.roles)}</span>
                        <ChevronDown className="text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {roleOptions.map((option) => {
                        const checked = member.roles.includes(option.value);
                        return (
                          <DropdownMenuCheckboxItem
                            key={option.value}
                            checked={checked}
                            disabled={checked && member.roles.length === 1}
                            onCheckedChange={(isChecked) =>
                              onRolesChange(
                                member,
                                isChecked
                                  ? [...member.roles, option.value]
                                  : member.roles.filter((role) => role !== option.value),
                              )
                            }
                          >
                            {option.label}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(member.joinedAt)}
                </TableCell>
                <TableCell className="text-right">
                  {confirmingUserId === member.userId ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={disabled}
                      onClick={() => {
                        setConfirmingUserId(null);
                        onRemove(member);
                      }}
                      onBlur={() => setConfirmingUserId(null)}
                    >
                      {t("members.confirmRemove")}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={disabled}
                      onClick={() => setConfirmingUserId(member.userId)}
                    >
                      {t("members.remove")}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
