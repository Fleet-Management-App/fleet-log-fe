# FleetLog FE

Front-end for FleetLog, the digital trip logbook. The API is
[fleet-log-be](https://github.com/Fleet-Management-App/fleet-log-be).

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 + shadcn/ui (radix, Nova preset) · lucide icons ·
Motion · TanStack Router (file-based) / Query / Form · zod · axios + orval · sonner

## Getting started

```
yarn install
cp .env.example .env.development
yarn start            # http://localhost:5180
```

| Script                      | What it does                                                                             |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| `yarn start`                | Dev server                                                                               |
| `yarn build`                | Type-check and production build                                                          |
| `yarn lint` / `yarn format` | ESLint / Prettier                                                                        |
| `yarn generate:api`         | Regenerate API hooks + DTOs from the running BE's OpenAPI spec into `src/api/generated/` |
| `yarn ui:add <component>`   | Add a shadcn component (use this, not `shadcn add` directly; see `scripts/ui-add.mjs`)   |

## Structure

```
src/
├── @types/          # module augmentations
├── api/generated/   # orval output, never edit by hand
├── config/          # env access (getEnvVariable), TanStack Query client
├── context/         # app-wide provider composition
├── routes/          # TanStack file-based routes, 5-20 lines each: path -> page
├── security/        # secured axios instance (auth to be decided)
├── styles.css       # Tailwind + shadcn theme variables
└── modules/
    ├── common/      # layout, shared pages, components/ui (shadcn), components/form, lib, hooks
    ├── dashboard/
    ├── trips/  fuel/  vehicles/  problems/  service/  anomalies/  finance/  users/
```

Every feature module uses the same inner layout, created as it is needed:

```
modules/<area>/
├── components/    # presentational: props in, JSX out
├── containers/    # data + handlers (queries, mutations)
├── dialogs/
├── forms/XForm/   # schema (zod), defaults, fields via useAppForm
├── hooks/{queries,mutations,custom}/
├── models/
├── pages/         # layout only
└── utils/
```

Layering: `routes/x.ts -> pages/XPage.tsx -> containers/XContainer.tsx -> components/X.tsx`.

## Conventions

- Components, pages, containers, forms: PascalCase files with a named export of the same name.
  Hooks and utils: camelCase. shadcn files in `components/ui/` stay as generated (kebab-case).
- Imports use the `@/` alias for `src/`.
- Env values only through `getEnvVariable(EnvVariableName.X)`.
- All requests go through `security/axios/axiosInstance.ts`.
- Forms use `useAppForm` from `modules/common/components/form/`, with zod schemas as validators.
- Business rules are referenced by their BR-ID from Confluence "04. Business Rules & Validations".
