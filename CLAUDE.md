# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (runs TypeScript check then Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm test` - Run tests in watch mode with Vitest
- `npm run test:run` - Run tests once

### Testing
- Unit tests use Vitest + Testing Library + jsdom
- Test setup file: `vitest.setup.ts` with globals enabled (no need to import it/expect)
- E2E tests use Playwright (in `tests/playwrite/`)
- MSW (Mock Service Worker) handles API mocking during development and testing

## Architecture

This is a React + TypeScript + Vite application using a **feature-first structure** (vertical slices). Each feature contains its own UI components, data hooks, API calls, state, mocks, and tests in a single folder.

**Important**: The application currently has OIDC authentication integration and is not using the standard MSW + React Query setup described below. The main entry point is configured for OIDC bootstrap in `src/main.tsx`.

### Key Technologies
- **React Router** for routing
- **TanStack Query** (`@tanstack/react-query`) for server state management and data fetching
- **Zustand** for client-side state (minimal usage)
- **Axios** for API calls (configured instance at `src/api/client.ts`)
- **MSW** for API mocking in development
- **OIDC authentication** with custom worker setup

### Project Structure
```
src/
├── main.tsx              # Entry point with OIDC bootstrap
├── App.tsx               # Root layout with navigation
├── router.tsx            # React Router configuration
├── auth/                 # OIDC authentication setup
│   ├── bootstrap.ts      # Authentication bootstrap logic
│   ├── setupOidcWorker.ts
│   ├── ReauthPrompt.tsx
│   └── TokenCard.tsx
├── api/client.ts         # Axios instance with baseURL config
├── features/             # Feature-first organization
│   ├── CollectionTable/  # Example feature with full structure
│   └── orders-table/     # Another feature example
├── pages/                # Route components that compose features
├── mocks/                # MSW configuration
│   ├── browser.ts        # MSW browser worker setup
│   └── handlers.ts       # Aggregated API handlers
├── state/                # App-wide Zustand stores
│   ├── ui.ts
│   └── authStore.ts      # Authentication state
├── lib/axios.ts          # Additional Axios configuration
├── env.ts                # Environment configuration
└── styles.css            # Global styles
```

### Feature Development Pattern
When adding new features, create a folder structure like:
```
src/features/feature-name/
├── components/           # UI components specific to this feature
├── hooks/               # React Query hooks for data fetching
├── api/                 # Axios calls specific to this feature
├── state/               # Feature-local Zustand stores (if needed)
├── mocks/               # MSW handlers for this feature's endpoints
├── tests/               # Tests colocated with the feature
└── index.ts             # Barrel exports for the feature's public API
```

### API Configuration
- Base URL configured via `VITE_API_URL` environment variable
- Falls back to `http://localhost:3000` if not set
- All API calls go through the configured Axios instance at `src/api/client.ts`

### State Management Guidelines
- Use React Query for server state (fetching, caching, background updates)
- Use Zustand sparingly for client-only state (like UI toggles)
- Keep feature-specific state within feature folders
- App-wide state goes in `src/state/`

### Testing Setup
- Tests run with Vitest in jsdom environment
- Setup file: `vitest.setup.ts`
- MSW handlers are automatically used in tests
- Tests should be colocated within feature folders when possible

### MSW Integration
- MSW starts automatically in development mode (`main.tsx`)
- Handlers are aggregated in `src/mocks/handlers.ts`
- Feature-specific handlers should be created in feature folders and imported into the main handlers file

### Import Conventions
- The project uses `@/` path alias for absolute imports (configured in `vite.config.ts` and `vitest.config.ts`)
- Example: `import { something } from '@/features/orders-table'`

### Authentication
- Uses OIDC (OpenID Connect) for authentication
- Bootstrap process in `src/auth/bootstrap.ts` initializes auth before React app
- OIDC worker handles token management via broadcast channel
- Auth state managed via Zustand in `src/state/authStore.ts`
- Environment configuration in `src/env.ts` sets up OAuth globals