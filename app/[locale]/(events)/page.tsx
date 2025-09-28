import { getTranslations } from 'next-intl/server';
import { fetchEvents } from '@/app/api';
import { Locale } from '@/app/types';
import { EventsExplorer } from '../../features';

export const revalidate = 300;

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function Page(props: Props) {
  const { locale } = await props.params;
  const t = await getTranslations();
  const events = await fetchEvents(locale, revalidate);

  return (
    <main className="py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">{t('events.title')}</h1>
      <EventsExplorer events={events} />
    </main>
  );
}
