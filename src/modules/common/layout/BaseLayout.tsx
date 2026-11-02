import type { FC } from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

// Root layout. The header lives in AppLayout, so signed-out pages (login, sign-up) stay bare.
export const BaseLayout: FC = () => (
  <div className="min-h-svh bg-background text-foreground">
    <Outlet />
    {import.meta.env.DEV && (
      <>
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </>
    )}
  </div>
);
