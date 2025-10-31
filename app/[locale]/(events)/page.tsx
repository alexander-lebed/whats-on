import { fetchEvents } from '@/app/api';
import { Locale } from '@/app/types';
import { EventsExplorer } from '../../features';

export const revalidate = 300;

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function Page(props: Props) {
  const { locale } = await props.params;
  const events = await fetchEvents(locale, revalidate);

  return (
    <main className="sm:py-8">
      <EventsExplorer events={events} />
    </main>
  );
}
