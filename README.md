# LawnFrontend

Next.js (App Router) + TypeScript + Tailwind v4 + shadcn/ui + React Query + zustand + zod + react-hook-form.

> Read [AGENTS.md](./AGENTS.md) before writing code. This project runs a newer
> Next.js version than most training data / tutorials — API's and conventions
> may differ from what you're used to.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in real values
pnpm dev
```

Open http://localhost:3000. Also visit `/example-todos` — it's a fully wired
reference feature (see "Adding a new feature" below).

## Scripts

| Script              | What it does                        |
| ------------------- | ----------------------------------- |
| `pnpm dev`          | Start the dev server                |
| `pnpm build`        | Production build                    |
| `pnpm start`        | Run the production build            |
| `pnpm lint`         | Lint                                |
| `pnpm lint:fix`     | Lint, fixing what's auto-fixable    |
| `pnpm format`       | Format the whole repo with Prettier |
| `pnpm format:check` | Check formatting without writing    |
| `pnpm typecheck`    | Run `tsc --noEmit`                  |

A pre-commit hook (husky + lint-staged) automatically lints and formats
staged files — you don't need to run `format`/`lint:fix` manually before
committing.

## Project structure

```
app/                    # Routes only (App Router). Keep pages thin — they
                         # compose components from features/ and components/.
  layout.tsx            # Root layout, wraps the app in Providers
  providers.tsx          # Client-side context providers (React Query, Toaster)
  page.tsx

features/                # One folder per domain feature. This is where most
                         # day-to-day work happens.
  example-todos/
    api.ts               # React Query hooks (useX / useCreateX)
    schema.ts             # zod schemas + inferred types
    store.ts              # zustand store for UI-only state local to the feature
    components/           # Feature-specific components
    index.ts              # Public exports — import from "@/features/x", not
                           # from internal files

components/
  ui/                    # shadcn/ui primitives — generated, don't hand-edit
                         # unless you know what you're doing. Add more with
                         # `pnpm dlx shadcn@latest add @shadcn/<name>`
  (shared components that aren't feature-specific go here)

lib/
  api-client.ts          # Thin typed fetch wrapper, reads config/env.ts
  query-client.ts         # React Query client factory
  utils.ts                # `cn()` and other small helpers

store/                   # zustand stores shared across features (global UI
                         # state, e.g. auth session, theme). Feature-local
                         # state belongs in features/*/store.ts instead.

hooks/                    # Shared React hooks not tied to one feature

types/                    # Shared TypeScript types not tied to one feature

config/
  env.ts                  # zod-validated environment variables — import
                         # `env` from here, never read `process.env` directly
```

### Adding a new feature

Copy `features/example-todos/` as a starting point:

1. **`schema.ts`** — define your zod schema(s) and export inferred types.
2. **`api.ts`** — write `fetchX`/`createX` functions using `apiClient` from
   `@/lib/api-client`, then wrap them in `useQuery`/`useMutation` hooks.
3. **`store.ts`** — only if the feature needs client-side UI state that
   doesn't belong in the server (filters, selection, wizard step, etc).
   Server data always goes through React Query, not zustand.
4. **`components/`** — build UI with shadcn primitives from `@/components/ui`.
   Use `react-hook-form` + `@hookform/resolvers/zod` for any form, validating
   against the schema from step 1.
5. **`index.ts`** — export what other code is allowed to import.
6. Wire it into a route under `app/`.

### Conventions

- **Server state vs. client state**: anything that comes from an API goes
  through React Query. zustand is only for state React Query doesn't own
  (UI toggles, filters, multi-step form state, etc).
- **Validation**: any data crossing a boundary (form input, API response,
  env vars) should be parsed with zod, not just typed.
- **Imports**: use the `@/` alias (maps to the repo root) instead of relative
  `../../..` paths.
- **shadcn components**: this project uses the `base-nova` style, which is
  built on `@base-ui/react` — not Radix. Polymorphism uses a `render` prop
  (`<Button render={<Link href="/x" />}>`), not `asChild`.
- **Environment variables**: add new ones to both `.env.example` and the
  schema in `config/env.ts`. The app fails fast at startup if a required
  var is missing or invalid.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [zustand](https://zustand.docs.pmnd.rs/)
- [zod](https://zod.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
