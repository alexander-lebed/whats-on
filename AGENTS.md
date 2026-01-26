# Whats-On

A Next.js 15 events platform with Sanity CMS, i18n, and HeroUI components.

## Commands
```bash
pnpm i          # Install dependencies
pnpm dev        # Dev server (usually already running)
pnpm lint       # TypeScript & ESLint checks
pnpm lint:fix   # Auto-fix lint errors + Prettier
pnpm test       # Run tests
```

## Code Formatting
Follow ESLint (`eslint.config.mjs`) and Prettier (`.prettierrc.json`) configurations. Run `pnpm lint:fix` after code generation to auto-format.

## Colors
Custom CSS variables defined in `app/globals.css`:
- `background` — Main background
- `foreground` — Text color
- `primary` — Accent/brand color

---

## Documentation
- [TypeScript Conventions](docs/typescript.md)
- [React Conventions](docs/react.md)
- [File & Folder Structure](docs/file-structure.md)
- [Testing](docs/testing.md)
- [External Libraries](docs/libraries.md) — next-intl, date-fns, Sanity, Google Maps, OpenAI
- [HeroUI Component Library](docs/heroui.md)