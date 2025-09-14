import { defineRouting } from 'next-intl/routing';
import { LANGUAGES } from '@/app/constants';

export const routing = defineRouting({
  locales: LANGUAGES.map(l => l.locale),
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
});

export type AppLocale = (typeof routing)['locales'][number];
