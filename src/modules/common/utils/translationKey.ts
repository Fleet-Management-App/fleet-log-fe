import type { ParseKeys } from "i18next";

import type { resources } from "@/config/i18n/resources";

type Namespace = keyof (typeof resources)["en"];

// A key with its namespace, e.g. "common:validation.email", checked against the English JSON files
export type TranslationKey = { [N in Namespace]: `${N}:${ParseKeys<N>}` }[Namespace];

export const translationKey = (key: TranslationKey) => key;
