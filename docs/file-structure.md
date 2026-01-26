# File & Folder Structure

## Directory Layout
```
app/[locale]      # top-level routes, one directory for each
app/features      # domain-specific components used by pages
app/ui            # design-system atoms & molecules (Button, Input, …)
app/providers     # React context providers
app/hooks         # global, reusable hooks
app/hooks/data    # global, reusable data-fetching hooks
app/utils         # global, reusable helper functions
app/types.ts      # global/shared TypeScript types
```

In each shared folder (except `/pages` & `/features`), add an `index.ts` that re-exports its modules for concise imports.

---

## Component Structure
Each component/feature must live in its own folder:

```
ComponentName/
  ComponentName.tsx       # Main component
  SubComponent.tsx        # Additional components (if needed)
  hooks/                  # Hooks used by components in this folder
  utils.ts                # Utils used across files in this folder
  types.ts                # Shared types across files in this folder
  constants.ts            # Shared constants across files in this folder
  index.ts                # Default export of the main component
```

---

## Nested Components
Nested components follow the same rules inside a subfolder:

```
ComponentName/
  ComponentName.tsx
  SubComponent.tsx
  hooks/
  utils.ts
  types.ts
  constants.ts
  index.ts 
  NestedComponentName/       # Nested component
    NestedComponentName.tsx
    NestedComponentName.test.tsx
    hooks/
    utils.ts
    types.ts
    constants.ts
    index.ts
```
