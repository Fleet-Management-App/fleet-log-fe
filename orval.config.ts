import { defineConfig } from "orval";

// Generates TanStack Query hooks and DTOs from the BE's springdoc spec.
// Run `yarn generate:api` with the BE running locally.
export default defineConfig({
  fleetLog: {
    input: { target: "http://localhost:8080/v3/api-docs" },
    output: {
      mode: "tags-split",
      target: "src/api/generated/hooks",
      schemas: "src/api/generated/models",
      client: "react-query",
      clean: true,
      override: {
        mutator: { path: "src/security/axios/axiosInstance.ts", name: "customInstance" },
      },
    },
  },
});
