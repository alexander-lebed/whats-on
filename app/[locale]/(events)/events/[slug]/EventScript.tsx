import type { FC } from 'react';
import Script from 'next/script';
import type { EVENTS_QUERY_I18NResult } from '@/sanity/types';

type EventScriptProps = {
  event: EVENTS_QUERY_I18NResult[number];
};

const EventScript: FC<EventScriptProps> = ({ event }) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.summary,
    startDate: event.schedule?.startDate ?? undefined,
    endDate: event.schedule?.endDate ?? undefined,
    eventAttendanceMode: event.isDigital
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: event.place
      ? {
          '@type': 'Place',
          name: event.place.title,
          address: event.place.address ?? undefined,
        }
      : undefined,
    offers: event.ticketUrl
      ? {
          '@type': 'Offer',
          url: event.ticketUrl,
          price: event.price,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        }
      : undefined,
  };

  return (
    <Script
      id={`event-jsonld-${event.slug}`}
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default EventScript;
