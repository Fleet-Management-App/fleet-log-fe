import type { FC } from "react";

import { useTranslation } from "react-i18next";

import type { LoginRequest } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";
import { FieldSeparator } from "@/modules/common/components/ui/field";

// The accounts the BE creates with DEMO_DATA_ENABLED=true (DemoDataInitializer)
const DEMO_PASSWORD = "demo1234";
const DEMO_ACCOUNTS = [
  { login: "jana", name: "Jana" },
  { login: "petr", name: "Petr" },
  { login: "eva", name: "Eva" },
  { login: "tomas", name: "Tomáš" },
] as const;

type DemoAccountsProps = {
  disabled: boolean;
  onPick: (credentials: LoginRequest) => void;
};

export const DemoAccounts: FC<DemoAccountsProps> = ({ disabled, onPick }) => {
  const { t } = useTranslation("auth");

  return (
    <div className="flex flex-col gap-3">
      <FieldSeparator>{t("demo.title")}</FieldSeparator>
      <div className="grid gap-2">
        {DEMO_ACCOUNTS.map(({ login, name }) => (
          <Button
            key={login}
            variant="outline"
            className="h-auto justify-between py-2"
            disabled={disabled}
            onClick={() => onPick({ email: `${login}@demo.fleetlog.app`, password: DEMO_PASSWORD })}
          >
            <span className="font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">{t(`demo.hints.${login}`)}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
