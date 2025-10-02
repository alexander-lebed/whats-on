import type { FC } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Map } from '@/app/features';
import type { Locale } from '@/app/types';
import { urlForImage } from '@/app/utils/sanityImage';
import type { EVENTS_QUERY_I18NResult } from '@/sanity/types';
import EventDetailsDates from './EventDetailsDates';
import EventDetailsHeader from './EventDetailsHeader';

type Props = {
  event: EVENTS_QUERY_I18NResult[number];
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

      {/* Hero */}
      <div className="w-full">
        <div
          className="relative w-full overflow-hidden rounded-2xl"
          style={{ aspectRatio: '16 / 9' }}
        >
          {imgUrl ? (
            <>
              {/* Blurred background to avoid black bars while preserving full image in foreground */}
              <Image
                src={imgUrl}
                alt=""
                aria-hidden
                fill
                priority
                className="object-cover blur-2xl scale-110 opacity-40"
                sizes="100vw"
              />
              <Image
                src={imgUrl}
                alt={event.title}
                fill
                priority
                className="object-contain"
                sizes="100vw"
              />
            </>
          ) : (
            <div className="h-full w-full bg-gray-100" />
          )}
        </div>
      </div>

      {/* Header & meta (shown under image on mobile only) */}
      <div className="sm:hidden">
        <EventDetailsHeader event={event} locale={locale} />
      </div>

      {/* Summary */}
      <p className="max-w-3xl leading-relaxed">{event.summary}</p>

      {/* Dates */}
      <EventDetailsDates schedule={event.schedule} locale={locale} />

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
                <span>{event.place.title}</span>
              </div>
              {event.place.address ? <p>{event.place.address}</p> : null}
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
                      return `https://maps.google.com/?q=${encodeURIComponent(event.place?.address ?? event.place?.title ?? '')}`;
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
