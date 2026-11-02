import type { FC } from "react";

import { Link, Outlet } from "@tanstack/react-router";
import { CarFront } from "lucide-react";

import { useGetMe } from "@/api/generated/hooks/account/account";
import { Role } from "@/api/generated/models";
import { OrganizationSwitcherContainer } from "@/modules/organizations/containers/OrganizationSwitcherContainer";
import { UserMenuContainer } from "@/modules/organizations/containers/UserMenuContainer";

const navLinkClass =
  "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground";
const activeNavLinkClass = "bg-muted text-foreground";

// Layout of every signed-in page: header with navigation, organization switcher and user menu.
export const AppLayout: FC = () => {
  const { data: me } = useGetMe();
  // Logging out clears the cache before the redirect to /login lands; render nothing meanwhile,
  // so nothing below calls useCurrentUser without data
  if (!me) return null;
  const { activeOrganization } = me;

  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <CarFront className="size-5 text-primary" />
            FleetLog
          </Link>
          {activeOrganization && (
            <nav className="flex items-center gap-1">
              <Link
                to="/"
                className={navLinkClass}
                activeProps={{ className: activeNavLinkClass }}
                activeOptions={{ exact: true }}
              >
                Dashboard
              </Link>
              {activeOrganization.role === Role.FLEET_MANAGER && (
                <Link
                  to="/organization/members"
                  className={navLinkClass}
                  activeProps={{ className: activeNavLinkClass }}
                >
                  Members
                </Link>
              )}
            </nav>
          )}
          <div className="ml-auto flex items-center gap-2">
            <OrganizationSwitcherContainer />
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
