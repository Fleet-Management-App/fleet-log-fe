import type { FC } from "react";

import { Link } from "@tanstack/react-router";

import { Button } from "@/modules/common/components/ui/button";

export const NotFoundPage: FC = () => (
  <div className="flex flex-col items-center gap-4 py-24 text-center">
    <h1 className="text-2xl font-semibold">Page not found</h1>
    <Button asChild variant="outline">
      <Link to="/">Back to the dashboard</Link>
    </Button>
  </div>
);
