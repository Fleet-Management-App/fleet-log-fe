import type { FC } from "react";

import { Link, type LinkProps, Outlet, useMatches } from "@tanstack/react-router";
import { CarFront } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useGetMe } from "@/api/generated/hooks/account/account";
import { Role } from "@/api/generated/models";
import { OrganizationSwitcherContainer } from "@/modules/organizations/containers/OrganizationSwitcherContainer";
import { UserMenuContainer } from "@/modules/organizations/containers/UserMenuContainer";
import { hasAnyRole } from "@/security/requireRole";

const navLinkClass =
  "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground";
const activeNavLinkClass = "bg-muted text-foreground";

type NavItem = { to: LinkProps["to"]; label: string; exact?: boolean };

// Layout of every signed-in page: header with navigation, organization switcher and user menu.
// The organization picker pages ask for a bare header instead (route staticData.minimalLayout).
export const AppLayout: FC = () => {
  const { t } = useTranslation();
  const { data: me } = useGetMe();
  const isMinimal = useMatches({
    select: (matches) => matches.some((match) => match.staticData.minimalLayout),
  });
  // Logging out clears the cache before the redirect to /login lands; render nothing meanwhile,
  // so nothing below calls useCurrentUser without data
  if (!me) return null;
  const { activeOrganization } = me;

  const isFleetManager = hasAnyRole(me, Role.FLEET_MANAGER);
  // The same menu for every role, minus what the role can't use (routes guard the same way)
  const navItems: NavItem[] = [
    { to: "/", label: t("nav.dashboard"), exact: true },
    { to: "/vehicles", label: t("nav.vehicles") },
    ...(hasAnyRole(me, Role.DRIVER, Role.FLEET_MANAGER)
      ? [{ to: "/trips", label: isFleetManager ? t("nav.trips") : t("nav.myTrips") } as NavItem]
      : []),
    ...(isFleetManager
      ? [
          { to: "/approvals", label: t("nav.approvals") } as NavItem,
          { to: "/organization/members", label: t("nav.members") } as NavItem,
        ]
      : []),
  ];

  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <CarFront className="size-5 text-primary" />
            FleetLog
          </Link>
          {activeOrganization && !isMinimal && (
            <nav className="flex items-center gap-1 overflow-x-auto">
              {navItems.map(({ to, label, exact }) => (
                <Link
                  key={to}
                  to={to}
                  className={navLinkClass}
                  activeProps={{ className: activeNavLinkClass }}
                  activeOptions={{ exact }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
          <div className="ml-auto flex items-center gap-2">
            {isMinimal ? (
              <span className="hidden text-sm sm:inline">{me.fullName}</span>
            ) : (
              <OrganizationSwitcherContainer />
            )}
            <UserMenuContainer />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </>
  );
};
