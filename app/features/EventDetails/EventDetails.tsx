import type { FC } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ImageHero, Map } from '@/app/features';
import { Event, Locale } from '@/app/types';
import { getPlaceAddress } from '@/app/utils';
import { urlForImage } from '@/app/utils/sanityImage';
import EventDetailsDates from './EventDetailsDates';
import EventDetailsHeader from './EventDetailsHeader';

type Props = {
  event: Event;
  locale: Locale;
};

export const EventDetails: FC<Props> = ({ event, locale }) => {
  const t = useTranslations();
  const imgUrl = urlForImage(event.image);

  return (
    <article className="flex flex-col gap-8 text-xl sm:text-lg">
      <div className="hidden sm:block">
        <EventDetailsHeader event={event} locale={locale} />
      </div>

      <ImageHero imgUrl={imgUrl} title={event.title} />

      {/* Header & meta (shown under image on mobile only) */}
      <div className="sm:hidden">
        <EventDetailsHeader event={event} locale={locale} />
      </div>

      {/* Summary */}
      <p className="max-w-3xl leading-relaxed whitespace-pre-line">{event.summary}</p>

      {/* Dates */}
      <EventDetailsDates schedule={event.schedule} locale={locale} />

      {/* Tickets & pricing */}
      {(event.ticketUrl || event.isFree || typeof event.price === 'number') && (
        <section aria-labelledby="tickets-heading" className="border-l-2 pl-4">
          <h2 id="tickets-heading" className="mb-3 text-sm font-semibold uppercase tracking-wide">
            {t('events.tickets')}
          </h2>

          {event.ticketUrl ? (
            <p className="flex items-center gap-2">
              <ExternalLink aria-hidden className="h-5 w-5" />
              <a
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                href={event.ticketUrl}
              >
                {t('events.tickets')}
              </a>
            </p>
          ) : null}

          {event.isFree === true || typeof event.price === 'number' ? (
            <p className="mt-4">
              <span className="font-medium">{t('events.price')}:</span>{' '}
              {event.isFree === true || !event.price || event.price <= 0
                ? t('events.free')
                : new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(event.price)}
            </p>
          ) : null}
        </section>
      )}

      {/* Address */}
      {(event.place || event.website) && (
        <section aria-labelledby="getting-there-heading" className="border-l-2 pl-4">
          <h2
            id="getting-there-heading"
            className="mb-3 text-sm font-semibold uppercase tracking-wide"
          >
            {t('events.getting-there')}
          </h2>
          {event.place ? (
            <div className="mb-2">
              <div className="mb-1 flex items-center gap-2">
                <MapPin aria-hidden className="h-5 w-5" />
                <span>{event.place.name}</span>
              </div>
              {event.place.address ? <p>{getPlaceAddress(event.place)}</p> : null}
              {event.place.address && (
                <p className="mt-2">
                  <a
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={(() => {
                      if (event.place?.location?.lat && event.place?.location?.lng) {
                        const { lat, lng } = event.place.location;
                        return `https://maps.google.com/?q=${lat},${lng}`;
                      }
                      return `https://maps.google.com/?q=${encodeURIComponent(getPlaceAddress(event.place) || event.place?.name)}`;
                    })()}
                  >
                    {t('events.open-in-google-maps')}{' '}
                    <ExternalLink aria-hidden className="ml-1 inline h-4 w-4 align-middle" />
                  </a>
                </p>
              )}
            </div>
          ) : null}

          {event.website ? (
            <p className="mt-4 flex items-center gap-2">
              <ExternalLink aria-hidden className="h-5 w-5" />
              <a
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                href={event.website}
              >
                {t('events.website')}
              </a>
            </p>
          ) : null}
        </section>
      )}
      {event.place?.location?.lat && event.place?.location?.lng ? (
        <section aria-label="Map" className="rounded-2xl overflow-hidden border border-stone-300">
          <Map places={[event.place]} />
        </section>
      ) : null}
    </article>
  );
};

export default EventDetails;
