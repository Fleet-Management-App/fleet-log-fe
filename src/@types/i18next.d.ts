import "i18next";

import type { resources } from "@/config/i18n/resources";

// Typed keys: t("nav.dashboard") is checked against the English JSON files at compile time
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: (typeof resources)["en"];
  }
}
