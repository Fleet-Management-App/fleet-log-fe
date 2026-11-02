import type { FC } from "react";

import type { LoginRequest } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";
import { FieldSeparator } from "@/modules/common/components/ui/field";

// The accounts the BE creates with DEMO_DATA_ENABLED=true (DemoDataInitializer)
const DEMO_PASSWORD = "demo1234";
const DEMO_ACCOUNTS = [
  { login: "jana", name: "Jana", hint: "Fleet Manager · also a Driver elsewhere" },
  { login: "petr", name: "Petr", hint: "Driver · has an invitation" },
  { login: "eva", name: "Eva", hint: "Accountant" },
  { login: "tomas", name: "Tomáš", hint: "Fleet Manager of Horská doprava" },
];

type DemoAccountsProps = {
  disabled: boolean;
  onPick: (credentials: LoginRequest) => void;
};

export const DemoAccounts: FC<DemoAccountsProps> = ({ disabled, onPick }) => (
  <div className="flex flex-col gap-3">
    <FieldSeparator>Demo accounts</FieldSeparator>
    <div className="grid gap-2">
      {DEMO_ACCOUNTS.map(({ login, name, hint }) => (
        <Button
          key={login}
          variant="outline"
          className="h-auto justify-between py-2"
          disabled={disabled}
          onClick={() => onPick({ email: `${login}@demo.fleetlog.app`, password: DEMO_PASSWORD })}
        >
          <span className="font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">{hint}</span>
        </Button>
      ))}
    </div>
  </div>
);
