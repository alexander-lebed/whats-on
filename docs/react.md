# React Conventions

## Component Syntax
Use **functional components** with **arrow functions**:
```tsx
const Component = (props: Props) => { ... }

export default Component;
```

## Imports
Destructure React imports:
```ts
import { useEffect } from 'react';
import type { ReactNode } from 'react';
```

## Hooks
Prefer `useCallback`, `useMemo`, etc., only when needed for performance.

## State Management
Handle component states with clear structure. Avoid unnecessary nesting or prop drilling — use context or custom hooks if needed.

## Icons
- Use icon components from `lucide-react` instead of hand-rolled SVGs, unless there is a strong, explicit design requirement.
- See `docs/libraries.md` → **Icons (lucide-react)** for usage details.
