import { type FC, useState } from "react";

import type { MemberResponse, Role } from "@/api/generated/models";
import { Badge } from "@/modules/common/components/ui/badge";
import { Button } from "@/modules/common/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/common/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/common/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/common/components/ui/table";
import { formatDate } from "@/modules/common/utils/formatDate";
import { ROLE_OPTIONS } from "@/modules/common/utils/roles";

type MembersTableProps = {
  members: MemberResponse[];
  currentUserId: string;
  isLoading: boolean;
  disabled: boolean;
  onRoleChange: (member: MemberResponse, role: Role) => void;
  onRemove: (member: MemberResponse) => void;
};

export const MembersTable: FC<MembersTableProps> = ({
  members,
  currentUserId,
  isLoading,
  disabled,
  onRoleChange,
  onRemove,
}) => {
  // Removing asks once more inline instead of a browser confirm dialog
  const [confirmingUserId, setConfirmingUserId] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>People ({members.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-44">Role</TableHead>
              <TableHead className="w-28">Joined</TableHead>
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {members.map((member) => (
              <TableRow key={member.userId}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2 font-medium">
                      {member.fullName}
                      {member.userId === currentUserId && <Badge variant="secondary">You</Badge>}
                    </span>
                    <span className="text-xs text-muted-foreground">{member.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={member.role}
                    disabled={disabled}
                    onValueChange={(role) => onRoleChange(member, role as Role)}
                  >
                    <SelectTrigger
                      size="sm"
                      className="w-full"
                      aria-label={`Role of ${member.fullName}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      Confirm
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={disabled}
                      onClick={() => setConfirmingUserId(member.userId)}
                    >
                      Remove
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
