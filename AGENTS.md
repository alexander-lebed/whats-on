### ✅ Code Generation & Project Conventions

All code generated must adhere to the following standards. Always consult the **latest documentation and examples at [Context7](https://context7.com/)** for up-to-date best practices and usage patterns.

---

#### 🧹 Code Formatting
- Always respect **ESLint** and **Prettier** configurations.
- Use formatting and lint scripts defined in `package.json` before committing or submitting code.

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
  const MyComponent: FC<Props> = ({ ... }) => { ... }
  ```
- Destructure React imports:
  ```ts
  import { FC, ReactNode, useEffect } from 'react';
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
- In each shared folder (except /pages & /features), add an index.ts that re-exports its modules for concise imports.

---

#### ✅ Testing & Documentation
- Write **unit tests** using `Jest` and `Testing Library`. Use `screen` to get elements using their role. Use `userEvent` over `fireEvent`.

---

#### ⚠️ Other Best Practices
- Try to avoid:
    - Deep nesting of components and logic
    - Mutable data structures
- Always prefer **semantic HTML** and accessible elements with proper `aria-*` when needed.
- Write **clear JSDoc or inline comments** when logic is not obvious.