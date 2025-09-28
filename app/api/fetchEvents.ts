import { Locale } from '@/app/types';
import { sanityFetch } from '@/lib/sanity/client';
import { EVENTS_QUERY_I18N } from '@/lib/sanity/queries';
import type { EVENTS_QUERY_I18NResult } from '@/sanity/types';

export const fetchEvents = async (
  locale: Locale,
  revalidate?: number
): Promise<EVENTS_QUERY_I18NResult> => {
  return sanityFetch<EVENTS_QUERY_I18NResult>(
    EVENTS_QUERY_I18N,
    { lang: locale },
    {
      revalidate,
      tags: ['events'],
    }
  );
};
