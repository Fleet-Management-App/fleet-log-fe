import type { FC } from "react";

import { LogOut } from "lucide-react";

import { Button } from "@/modules/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/common/components/ui/dropdown-menu";

type UserMenuProps = {
  fullName: string;
  email: string;
  onLogout: () => void;
};

const initials = (fullName: string) =>
  fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const UserMenu: FC<UserMenuProps> = ({ fullName, email, onLogout }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="rounded-full bg-muted" aria-label="Account">
        {initials(fullName)}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel className="flex flex-col">
        <span className="text-sm text-foreground">{fullName}</span>
        <span className="truncate font-normal">{email}</span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={onLogout}>
        <LogOut />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
