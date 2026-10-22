import type { FC } from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { CarFront } from "lucide-react";

export const BaseLayout: FC = () => (
  <div className="min-h-svh bg-background text-foreground">
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <CarFront className="size-5 text-primary" />
          FleetLog
        </Link>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Outlet />
    </main>
    {import.meta.env.DEV && (
      <>
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </>
    )}
  </div>
);
