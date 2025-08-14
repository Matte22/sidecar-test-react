# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


# Sidecar Web App – Feature-First Structure

A small, fast React + Vite app organized by **features (vertical slices)** so each capability lives in one place (UI, data, state, tests, mocks). This makes it easy to add/remove features, onboard new devs, and keep domain logic from leaking all over the repo.

## Goals (WHY this structure)
- **Encapsulation:** Everything for a feature (UI, hooks, API, mocks, tests) stays together → easier to reason about and refactor.
- **Clear ownership:** Teams can “own” a folder. PRs touch fewer files outside the feature.
- **Low coupling:** Shared stuff is truly generic; domain specifics don’t pollute global layers.
- **Testing in place:** MSW handlers + tests live beside the code they validate.
- **Gradual growth:** Start tiny, scale without a rewrite.

## Tech
- React + Vite + TypeScript
- React Router
- TanStack Query (`@tanstack/react-query`) for server cache/fetching
- Zustand for small client state
- Axios for API calls
- MSW for local API mocking
- Vitest + Testing Library

## Folder structure
```plaintext
src/
  pages/                 # thin route components that compose features
    Home.tsx
  features/
    orders-table/             # <- a vertical slice (example)
      components/
        *.tsx
        *.tsx
      hooks/
        useWidgets.ts    # react-query hooks for this feature
      api/
        widgets.api.ts   # axios calls for this feature
      state/
        widgets.store.ts # zustand (only if feature-local)
      mocks/
        widgets.handlers.ts  # MSW handlers for this feature
      tests/
        WidgetList.test.tsx
      index.ts           # barrel exports (public surface)
    notifications/
      ... same pattern ...
  components/            # truly reusable, generic UI (no domain/data)
    Button.tsx
    Modal.tsx
    DataTable/
      DataTable.tsx
      types.ts
  hooks/                 # cross-cutting generic hooks
    useLocalStorage.ts
  lib/                   # cross-cutting utils/clients (no domain logic)
    axios.ts             # axios instance (baseURL, interceptors) like a api client
    constants.ts         # types
  mocks/                 # MSW wiring for the whole app
    browser.ts
    handlers.ts
    server.ts          # aggregates feature handlers
  state/                 # app-wide stores (theme/layout only)
    ui.store.ts
  styles/                # global CSS (if needed)
    globals.css
  main.tsx
  App.tsx                # optional, often replaced by layouts
  index.css
  main.tsx
  router.tsx
  styles.css
  test-utils.tsx 
  ... .
  ... .

```


Pages vs Features vs Components (WHAT goes WHERE)
-------------------------------------------------

*   **features/** → Domain-specific everything for one capability (UI + data + state + mocks + tests).
    
*   **pages/** → Route endpoints that **compose** features. Keep these thin.
    
*   **components/** → Truly shared, generic UI. No domain logic. No data fetching.
    

> If a “shared” component needs to know about widgets (types, endpoints, query keys), it’s **not** shared—move it back into that feature.


State management
----------------

*   **React Query** for server state (fetching, caching, retries).
    
*   **Zustand** only when you need client-only, feature-local state (e.g., a sidebar toggle).
    
*   **state/** for app-wide state (theme, layout). Avoid global dumping grounds.
  


## State model (who owns what)
- **Server cache state** → **TanStack Query**: fetch, cache, retries, background refresh, pagination, optimistic updates.
- **Cross-component client state** → **Zustand**: lightweight store for UI/session bits that multiple components need (e.g., table preferences, wizard step).
- **Ephemeral/component state** → React `useState`/`useReducer` for strictly local UI.
- **URL/router state** → **React Router**: params, search, and navigation as state (shareable and deep-linkable).

Rule of thumb: data from the server lives in Query; UI intent/preferences live in Zustand; one-off view state stays local; navigational state belongs to the Router.


Testing & MSW
-------------

*   Keep tests next to the code they cover (\_\_tests\_\_/ in each feature).
    
*   Use MSW handlers inside each feature; aggregate once in src/mocks/handlers.ts.
    
*   Dev server starts MSW in main.tsx (DEV only).
    

Naming & Conventions
--------------------

*   **Feature folders:** kebab-case (user-settings, widgets).
    
*   **Components:** PascalCase.tsx.
    
*   **Hooks:** useThing.ts.
    
*   **Stores:** .store.ts.
    
*   **Handlers:** .handlers.ts.
    
*   **Barrels:** index.ts (export only what the rest of the app should use).
    

When NOT to create a feature
----------------------------

*   Purely presentational component with no domain logic → belongs in components/.
    
*   One-off local UI inside a single page → just keep it in that page (until it grows).
    

Anti-patterns (WHAT to avoid)
-----------------------------

*   A giant global components/ that knows your domain.
    
*   Fetching data inside shared components.
    
*   “God” utils in lib/ that import from features (only _downstream_ imports into features).
    
*   Mixing app-wide state with feature-local state.
    
Links to resources
-----------------------------


## 🪝 Custom Hooks / Composables
- **React — Custom Hooks**
  - Docs: https://react.dev/learn/reusing-logic-with-custom-hooks
  - Video (not beginner-level, deeper dive): https://www.youtube.com/watch?v=I2Bgi0Qcdvc
- **Vue — Composables**
  - Docs: https://vuejs.org/guide/reusability/composables
  - Article (good practices & patterns): https://dev.to/jacobandrewsky/good-practices-and-design-patterns-for-vue-composables-24lk

---

## 🔄 Server State
- **TanStack Query (React)**
  - Docs: https://tanstack.com/query/latest/docs/framework/react/overview
  - Simple intro video: https://www.youtube.com/watch?v=w9r55wd2CAk

---

## 📦 Client State
- **Zustand (React)**
  - Docs: https://zustand.docs.pmnd.rs/getting-started/introduction
  - Video (minute ~16 for key concept): https://www.youtube.com/watch?v=_ngCLZ5Iz-0&t=2s
- **Pinia (Vue)**
  - Docs: https://pinia.vuejs.org/
  - Video (comparison to React state concepts, older but useful): https://youtu.be/gwcca_zd4IE?si=Xx7WFkR-4a9WmnEp

---

## 🛠 other random things that arent important at this moment
- **ESLint** — https://eslint.org/
- **Vitest** — https://vitest.dev/
- **MSW (Mock Service Worker)** — https://mswjs.io/
