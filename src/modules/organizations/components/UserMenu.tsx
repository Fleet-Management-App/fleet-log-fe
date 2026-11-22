import type { FC } from "react";

import { Languages, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

import { type Language, LANGUAGES } from "@/config/i18n/resources";
import { Button } from "@/modules/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/common/components/ui/dropdown-menu";

type UserMenuProps = {
  fullName: string;
  email: string;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onLogout: () => void;
};

const getInitials = (fullName: string) =>
  fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const UserMenu: FC<UserMenuProps> = ({
  fullName,
  email,
  language,
  onLanguageChange,
  onLogout,
}) => {
  const { t } = useTranslation(["organizations", "common"]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-muted"
          aria-label={t("userMenu.account")}
        >
          {getInitials(fullName)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm text-foreground">{fullName}</span>
          <span className="truncate font-normal">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2 font-normal">
          <Languages className="size-4" />
          {t("common:language.label")}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={language}
          onValueChange={(value) => onLanguageChange(value as Language)}
        >
          {LANGUAGES.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {t(`common:language.${option}`)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onLogout}>
          <LogOut />
          {t("userMenu.logOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
