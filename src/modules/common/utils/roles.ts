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

// A person can hold several roles in one organization; always list them in the same order
export const sortRoles = (roles: Role[]): Role[] =>
  Object.values(Role).filter((role) => roles.includes(role));

export const formatRoles = (roles: Role[]): string =>
  sortRoles(roles)
    .map((role) => ROLE_LABELS[role])
    .join(", ");
