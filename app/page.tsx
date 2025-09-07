import { sanityFetch } from '@/lib/sanity/client';
import { EVENTS_QUERY_I18N } from '@/lib/sanity/queries';
import type { EVENTS_QUERY_I18NResult } from '@/sanity/types';
import { EventsGrid } from './features';

export const revalidate = 300;

export default async function Page() {
  // TODO: derive lang from request (headers, path, cookies). For now default to 'es'
  const lang = 'en';
  const data = await sanityFetch<EVENTS_QUERY_I18NResult>(
    EVENTS_QUERY_I18N,
    { lang },
    {
      revalidate,
      tags: ['events'],
    }
  );

  return (
    <main className="py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Events</h1>
      <section aria-labelledby="popular-heading">
        <h2 id="popular-heading" className="sr-only">
          Events list
        </h2>
        <EventsGrid items={data} />
      </section>
    </main>
  );
}
