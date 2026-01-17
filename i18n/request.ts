import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: {
      common: (await import(`./${locale}/common.json`)).default,
      events: (await import(`./${locale}/events.json`)).default,
      organizers: (await import(`./${locale}/organizers.json`)).default,
    },
  } as const;
});
