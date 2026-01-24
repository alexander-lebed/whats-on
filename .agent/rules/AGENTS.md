### ✅ Code Generation & Project Conventions

All code generated must adhere to the following standards. Always consult the **latest documentation and examples at [Context7](https://context7.com/)** for up-to-date best practices and usage patterns.

---

#### 🧹 Code Formatting
- Always respect **ESLint** and **Prettier** configurations.
- Always follow the repository ESLint rules defined in `eslint.config.mjs`.
- Use formatting and lint scripts defined in `package.json` before committing or submitting code using `pnpm`.
- Run `pnpm lint` to check ESLint errors.
- Run `pnpm lint:fix` to auto-fix ESLint errors and format with Prettier.

---

#### 🟨 JavaScript
- Use **modern syntax** and **language features** (e.g. optional chaining, nullish coalescing).
- Follow clean code principles: meaningful names, single responsibility functions, and avoid magic values.

---

#### 🟦 TypeScript
- Use `type` instead of `interface` for consistency and better union/intersection handling.
- Favor **type inference** when possible to reduce verbosity.
- Always annotate **function return types** and public method signatures.
- Leverage utility types (`Partial`, `Pick`, `Record`, etc.) where appropriate.
- Avoid `any`.

---

#### ⚛️ React
- Use **functional components** with **arrow functions**:
  ```tsx
  const Component = (props: Props) => { ... }
  
  export default Component;
  ```
- Destructure React imports:
  ```ts
  import { useEffect } from 'react';
  import type { ReactNode } from 'react';
  ```
- Use **hooks** effectively. Prefer `useCallback`, `useMemo`, etc., only when needed for performance.
- Handle component states with clear structure. Avoid unnecessary nesting or prop drilling — use context or custom hooks if needed.

---

#### 📁 File & Folder Structure
- Structure code into clearly defined directories:
  ```
  /pages           → top-level routes, one directory for each
  /features        → domain-specific components used by pages
  /ui              → design-system atoms & molecules (Button, Input, …)
  /providers       → React context providers
  /hooks           → reusable hooks
  /hooks/data      → data-fetching hooks
  /utils           → general helper functions
  /types           → global/shared TypeScript types
  ```
- In each shared folder (except /pages & /features), add an index.ts that re-exports its modules for concise imports. Also add feature-specific files (if any) to /utils.ts, /hooks.ts, ./constants.ts, and /types.ts.

---

#### ✅ Testing & Documentation
- **Unit testing**
  - Write tests with `Jest` and `@testing-library/react`. Prefer `screen.getByRole` and `userEvent` over `fireEvent`.

- **Internationalization (next-intl)**
  - Getting started (App Router): [next-intl App Router guide](https://next-intl.dev/docs/getting-started/app-router)
  - Usage: [next-intl Usage guide](https://next-intl.dev/docs/usage)
  - Navigation [next-intl Navigation](https://next-intl.dev/docs/routing/navigation)
  - Use kebab-case for i18n message keys (e.g., `common.header-title`, `events.empty-state.title`). Avoid camelCase and snake_case.

- **Forms & Validation**
  - React Hook Form: [useForm](http://react-hook-form.com/docs/useform)
  - Zod: [API](https://zod.dev/api)

- **Sanity CMS**
  - Docs: [Sanity documentation](https://www.sanity.io/docs)
  - GROQ: [Spec](https://www.sanity.io/docs/specifications/groq-syntax), [Cheat sheet](https://www.sanity.io/docs/content-lake/query-cheat-sheet)

- **HeroUI** Component library
  - Main docs: [HeroUI Introduction](https://www.heroui.com/docs/guide/introduction)
  - Next.js Setup: [HeroUI Next.js Guide](https://www.heroui.com/docs/frameworks/nextjs)
  - All Components: [HeroUI Components](https://www.heroui.com/docs/components/accordion)

- **Date utilities**
  - date-fns: [format](https://date-fns.org/v4.1.0/docs/format), [parseISO](https://date-fns.org/v4.1.0/docs/parseISO), [addDays](https://date-fns.org/v4.1.0/docs/addDays)
  - Prefer date-fns over custom date math. Work with ISO strings and use `parseISO`, then format with `format`.

- **Google Maps (React)**
  - Get Started: [vis.gl react-google-maps - Get Started](https://visgl.github.io/react-google-maps/docs/get-started)
  - Introduction & Docs: [vis.gl react-google-maps - Docs](https://visgl.github.io/react-google-maps/docs)
  - Map API: [<Map> Component](https://visgl.github.io/react-google-maps/docs/api-reference/components/map)
  - AdvancedMarker API: [<AdvancedMarker> Component](https://visgl.github.io/react-google-maps/docs/api-reference/components/advanced-marker)
  - Places Autocomplete Data API: [Place Autocomplete Data API](https://developers.google.com/maps/documentation/javascript/place-autocomplete-data)
  - Autocomplete and session pricing: [Autocomplete and session pricing](https://developers.google.com/maps/documentation/javascript/session-pricing)

- **OpenAI API**
  - Overview: [OpenAI Platform Overview](https://platform.openai.com/docs/overview)
  - API Reference: [OpenAI API Reference](https://platform.openai.com/docs/api-reference/)
  - Structured Outputs: [Structured Outputs Guide](https://platform.openai.com/docs/guides/structured-outputs)
  - JavaScript/TypeScript SDK: [openai-node SDK](https://github.com/openai/openai-node)
---

#### 🎨 HeroUI Component Library
**HeroUI** is a React UI library built on top of Tailwind CSS and React Aria for building accessible and customizable user interfaces.

- **Key Features:**
  - 210+ accessible, customizable components
  - Built on Tailwind CSS (no runtime CSS)
  - React Aria for accessibility features
  - Full TypeScript support
  - Dark mode support (automatically includes `light` and `dark` themes)
  - Compatible with Next.js App Router and Pages directory

- **Installation & Setup:**
  - Main docs: [HeroUI Introduction](https://www.heroui.com/docs/guide/introduction)
  - Next.js Setup: [HeroUI Next.js Guide](https://www.heroui.com/docs/frameworks/nextjs)
  - Installation Guide: [HeroUI Installation](https://www.heroui.com/docs/guide/installation)
  - The project already has HeroUI configured with `hero.ts` and `HeroUIProvider` in `app/providers.tsx`

- **Individual Component Installation:**
  - This project uses **individual HeroUI packages** for better tree-shaking and reduced CSS bundle size
  - Core packages already installed: `@heroui/system`, `@heroui/theme`, `@heroui/react-core`
  - To add a new component (e.g., Modal):
    ```bash
    pnpm add @heroui/modal
    ```
  - Then import from the individual package:
    ```tsx
    import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal';
    ```
  - **Always import from individual packages** (e.g., `@heroui/button`) instead of the umbrella `@heroui/react`

- **Important Notes:**
  - Import components from individual packages, not from `@heroui/react` (e.g., `import { Button } from '@heroui/button'`)
  - Components can be imported directly in Server Components (HeroUI adds `use client` at build time)
  - Use `tailwind-variants` to handle Tailwind CSS class conflicts with custom overrides

- **Common Components:**
  - Button: [Button Docs](https://www.heroui.com/docs/components/button) - Customizable with variants (solid, bordered, light, flat, faded, shadow, ghost), colors, sizes, and loading states
  - For a complete list of 210+ components, see: [HeroUI Components](https://www.heroui.com/docs/components/accordion)

- **Customization:**
  - Theme customization: [Theme Docs](https://www.heroui.com/docs/customization/theme)
  - Colors, layout, and dark mode can be customized in your theme configuration
---

#### ⚠️ Other Best Practices
- Try to avoid:
  - Deep nesting of components and logic
  - Mutable data structures
- Always prefer **semantic HTML** and accessible elements with proper `aria-*` when needed.
- Write **clear JSDoc or inline comments** when logic is not obvious.