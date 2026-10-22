import { createRouter } from "@tanstack/react-router";

import { EnvVariableName, getEnvVariable } from "@/config/env/getEnvVariable";
import { routeTree } from "@/routeTree.gen";

const basepath = getEnvVariable(EnvVariableName.PUBLIC_URL, undefined, false);

export const router = createRouter({
  ...(basepath ? { basepath } : null),
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
