import { Role } from "@/api/generated/models";

export const ROLE_LABELS: Record<Role, string> = {
  [Role.DRIVER]: "Driver",
  [Role.FLEET_MANAGER]: "Fleet Manager",
  [Role.ACCOUNTANT]: "Accountant",
};

export const ROLE_OPTIONS = Object.values(Role).map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));
