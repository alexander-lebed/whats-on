import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Locale } from '@/app/types';
import { sanityFetch } from '@/lib/sanity/client';
import { EVENTS_QUERY_I18N } from '@/lib/sanity/queries';
import type { EVENTS_QUERY_I18NResult } from '@/sanity/types';
import { EventsExplorer } from '../../features';

export const revalidate = 300;

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function Page(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const data = await sanityFetch<EVENTS_QUERY_I18NResult>(
    EVENTS_QUERY_I18N,
    { lang: locale },
    {
      revalidate,
      tags: ['events'],
    }
  );

  return (
    <main className="py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">{t('events.title')}</h1>
      <EventsExplorer items={data} />
    </main>
  );
}
