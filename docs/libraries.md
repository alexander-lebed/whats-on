# External Libraries

## Internationalization (next-intl)
- Getting started (App Router): [next-intl App Router guide](https://next-intl.dev/docs/getting-started/app-router)
- Usage: [next-intl Usage guide](https://next-intl.dev/docs/usage)
- Navigation: [next-intl Navigation](https://next-intl.dev/docs/routing/navigation)
- Use **kebab-case** for i18n message keys (e.g., `common.header-title`, `events.empty-state.title`). Avoid camelCase and snake_case.

---

## Forms & Validation
- React Hook Form: [useForm](http://react-hook-form.com/docs/useform)
- Zod: [API](https://zod.dev/api)

---

## Sanity CMS
- Docs: [Sanity documentation](https://www.sanity.io/docs)
- GROQ: [Spec](https://www.sanity.io/docs/specifications/groq-syntax), [Cheat sheet](https://www.sanity.io/docs/content-lake/query-cheat-sheet)

---

## Icons (lucide-react)
- `lucide-react` is the standard icon library for this project.
- Docs & gallery: [lucide.dev](https://lucide.dev/)
- Import icons as named imports (no wildcard or dynamic imports), for example:
  ```tsx
  import { MapPin } from 'lucide-react';
  ```
- Prefer using an existing `lucide-react` icon over creating custom SVGs. Only create bespoke icons if `lucide-react` cannot cover a strong design requirement.

---

## Date Utilities (date-fns)
- [format](https://date-fns.org/v4.1.0/docs/format), [parseISO](https://date-fns.org/v4.1.0/docs/parseISO), [addDays](https://date-fns.org/v4.1.0/docs/addDays)
- Prefer date-fns over custom date math. Work with ISO strings and use `parseISO`, then format with `format`.

---

## Google Maps (React)
- Get Started: [vis.gl react-google-maps - Get Started](https://visgl.github.io/react-google-maps/docs/get-started)
- Introduction & Docs: [vis.gl react-google-maps - Docs](https://visgl.github.io/react-google-maps/docs)
- Map API: [`<Map>` Component](https://visgl.github.io/react-google-maps/docs/api-reference/components/map)
- AdvancedMarker API: [`<AdvancedMarker>` Component](https://visgl.github.io/react-google-maps/docs/api-reference/components/advanced-marker)
- Places Autocomplete Data API: [Place Autocomplete Data API](https://developers.google.com/maps/documentation/javascript/place-autocomplete-data)
- Autocomplete and session pricing: [Autocomplete and session pricing](https://developers.google.com/maps/documentation/javascript/session-pricing)

---

## OpenAI API
- Overview: [OpenAI Platform Overview](https://platform.openai.com/docs/overview)
- API Reference: [OpenAI API Reference](https://platform.openai.com/docs/api-reference/)
- Structured Outputs: [Structured Outputs Guide](https://platform.openai.com/docs/guides/structured-outputs)
- JavaScript/TypeScript SDK: [openai-node SDK](https://github.com/openai/openai-node)
