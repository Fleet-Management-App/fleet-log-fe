import { useTranslation } from "react-i18next";

import { Role } from "@/api/generated/models";

// A person can hold several roles in one organization; always list them in the same order
export const sortRoles = (roles: Role[]): Role[] =>
  Object.values(Role).filter((role) => roles.includes(role));

// Role names in the current language; a hook, so the caller re-renders when the language changes
export const useRoleLabels = () => {
  const { t } = useTranslation();
  const getRoleLabel = (role: Role) => t(`roles.${role}`);

  return {
    getRoleLabel,
    formatRoles: (roles: Role[]) => sortRoles(roles).map(getRoleLabel).join(", "),
    roleOptions: Object.values(Role).map((role) => ({ value: role, label: getRoleLabel(role) })),
  };
};
