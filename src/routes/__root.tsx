import { createRootRoute } from "@tanstack/react-router";

import { BaseLayout } from "@/modules/common/layout/BaseLayout";
import { NotFoundPage } from "@/modules/common/pages/NotFoundPage";

export const Route = createRootRoute({
  component: BaseLayout,
  notFoundComponent: NotFoundPage,
  errorComponent: ({ error }) => (
    <div className="p-6 text-destructive">
      {error instanceof Error ? error.message : String(error)}
    </div>
  ),
});
