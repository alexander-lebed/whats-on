# HeroUI Component Library

**HeroUI** is a React UI library built on top of Tailwind CSS and React Aria for building accessible and customizable user interfaces.

## Key Features
- 210+ accessible, customizable components
- Built on Tailwind CSS (no runtime CSS)
- React Aria for accessibility features
- Full TypeScript support
- Dark mode support (automatically includes `light` and `dark` themes)
- Compatible with Next.js App Router and Pages directory

## Documentation
- Main docs: [HeroUI Introduction](https://www.heroui.com/docs/guide/introduction)
- Next.js Setup: [HeroUI Next.js Guide](https://www.heroui.com/docs/frameworks/nextjs)
- Installation Guide: [HeroUI Installation](https://www.heroui.com/docs/guide/installation)
- All Components: [HeroUI Components](https://www.heroui.com/docs/components/accordion)

## Project Setup
The project already has HeroUI configured with `hero.ts` and `HeroUIProvider` in `app/providers.tsx`.

## Individual Package Installation
This project uses **individual HeroUI packages** for better tree-shaking and reduced CSS bundle size.

Core packages already installed: `@heroui/system`, `@heroui/theme`, `@heroui/react-core`

To add a new component (e.g., Modal):
```bash
pnpm add @heroui/modal
```

Then import from the individual package:
```tsx
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal';
```

**Always import from individual packages** (e.g., `@heroui/button`) instead of the umbrella `@heroui/react`.

## Important Notes
- Components can be imported directly in Server Components (HeroUI adds `use client` at build time)
- Use `tailwind-variants` to handle Tailwind CSS class conflicts with custom overrides

## Customization
- Theme customization: [Theme Docs](https://www.heroui.com/docs/customization/theme)
- Colors, layout, and dark mode can be customized in your theme configuration
