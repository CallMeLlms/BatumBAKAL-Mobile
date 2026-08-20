# AGENTS.md — BatumBAKAL Mobile

Mobile fitness tracking app (Expo / React Native). Handles auth, program creation, workout-day building, session logging, progress charts, and profile. Connects to the BatumBAKAL backend REST API.

## Tech Stack

- React Native 0.76.9 / Expo ~52.0.49
- TypeScript 5.3 (strict)
- expo-router ~4.0.22 (file-based routing) + React Navigation v7 (bottom tabs)
- NativeWind ~4.2.1 + Tailwind CSS 3.4 (styling)
- Zustand 5 (state), Axios 1 (HTTP), React Hook Form 7 (forms)
- @gorhom/bottom-sheet, Reanimated, Skia 1.5 (charts), expo-secure-store (tokens)
- Jest + jest-expo (testing), ESLint (expo config)

## Commands

- `npx expo start` — start Expo dev server
- `npx tsc --noEmit` — typecheck
- `npm run lint` — ESLint via expo lint
- `npm test` — jest-expo in watch mode
- `npx jest --runInBand --watchAll=false` — tests, CI-style single run

## Testing First

Write jest-expo tests before building a feature — fail (red), then implement until they pass (green). Tests live in `components/__tests__/` (mirroring the existing `components/__tests__/StatCard.test.tsx` pattern).

- Use **@testing-library/react-native** (`render`, `screen.getByText(...)`, `fireEvent`) with behavioral queries — prefer these over `react-test-renderer` snapshots for new tests.
- `react-test-renderer` stays installed only for legacy snapshot tests; do not write new snapshot tests.
- Target simple, self-contained components (`ui/`, `stat-components/`) for unit tests; keep tests to one component/file.

Verify with `npx jest --runInBand --watchAll=false StatCard` while iterating on a component, and the full suite before completion.

## Verification Flow

Before claiming work is complete:

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm test`

## Project Structure

```
app/        # expo-router screens & layouts
  _layout.tsx        # root layout: auth guard, providers, interceptor import
  index.tsx
  +not-found.tsx
  (auth)/            # signIn, signUp
  (tabs)/            # log, program, progress, profile (+ sub-screens)
api/        # axios instance, services, jwtInterceptor
components/ # feature-folder components matching tabs + shared ui/ primitives
config/     # environment.ts (API_URL from Expo config extras)
constants/  # theme colors, fonts, shared values
hooks/      # custom hooks (useLogout, useRefresh, useColorScheme, app fonts)
lib/        # theme, utils, error/ (AppError, errorHandler)
scripts/    # dev scripts
stores/     # Zustand stores (auth, log, profile, program, progress, bottomSheet, toast)
types/      # shared TS types (auth, program, workout, index)
utils/      # auth/ (secure-store token storage), format/, log/, settings/
```

## Conventions

- Path alias `@/*` maps to repo root (see `tsconfig.json`); import with `@/...`.
- Strict TypeScript; no JS in mobile.
- Feature-based folders mirror app tabs (`log-`, `program-`, `progress-`, `profile-`, `home-`).
- Store layering: UI-state stores (builderStore, bottomSheetStore) are kept separate from data stores that call API services (programDataStore, profileStore, workdayDataStore, progressStores).
- API services in `api/services/` are thin Axios wrappers; stores wrap them.
- `api/interceptors/jwtInterceptor.ts` is registered as a side-effect import in `app/_layout.tsx` — do not re-register it elsewhere.
- Shared UI primitives live in `components/ui/`.

## Auth

- Tokens in expo-secure-store via `utils/auth/authStorage.ts` (`authToken` short-lived JWT, `refreshTokenKey` refresh token).
- Root layout `app/_layout.tsx` guards routes: unverified → redirect to `(auth)/signIn`; verified → `(tabs)/log`.
- Interceptor attaches `Authorization: Bearer`, refreshes on 401 (single-flight, queues concurrent requests), signs out on refresh failure.

## Environment & Security

- `.env` holds `DEV_PHYSICAL_DEVICE_IP` (backed by `app.config.ts` `extra.apiUrl` → `config/environment.ts` API_URL).
- Expo config extras are bundled into the app — never store secrets there.
- Never commit `.env` or any local IP/TODO/FIXME/debug strings: the CI safety scan (`.github/workflows/mobile-safety-scan.yml`) blocks them on push/PR to `master`.

## State of the App (in development)

- Built: scaffolding/navigation, auth flows, API layer, Zustand stores, bottom tabs, program creation, workout-day builder, logging, progress dashboard, profile.
- Roadmap gaps per README: live workout logging flow refinements, progress chart history viz, profile editing, production build/release.