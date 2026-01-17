import type { FC } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ImageHero, Map } from '@/app/features';
import { Event, Locale } from '@/app/types';
import Button from '@/app/ui/Button/Button';
import { getPlaceAddress } from '@/app/utils';
import { urlForImage } from '@/app/utils/sanityImage';
import EventDetailsActions from './EventDetailsActions';
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
        <section
          aria-labelledby="tickets-heading"
          className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-stone-100/50 p-6 dark:border-none dark:bg-transparent dark:p-0"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="tickets-heading" className="text-lg font-bold text-foreground">
              {t('events.tickets')}
            </h2>
            {event.isFree === true || typeof event.price === 'number' ? (
              <p className="text-right text-lg font-medium">
                {event.isFree === true || !event.price || event.price <= 0 ? null : (
                  <span className="mr-2 text-base font-normal text-stone-500">
                    {t('events.min-price')}:
                  </span>
                )}
                {event.isFree === true || !event.price || event.price <= 0
                  ? t('events.free')
                  : new Intl.NumberFormat(locale, {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(event.price)}
              </p>
            ) : null}
          </div>

          {event.ticketUrl ? (
            <div>
              <Button
                as="a"
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                variant="solid"
                endContent={<ExternalLink className="h-4 w-4" />}
                className="w-full sm:w-auto text-white"
              >
                {t('events.tickets')}
              </Button>
            </div>
          ) : null}
        </section>
      )}

      {/* Address */}
      {(event.place || event.website) && (
        <section
          aria-labelledby="getting-there-heading"
          className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-stone-100/50 p-6 dark:border-none dark:bg-transparent dark:p-0"
        >
          <h2 id="getting-there-heading" className="text-lg font-bold text-foreground">
            {t('events.getting-there')}
          </h2>

          {event.place ? (
            <div>
              <div className="mb-1 flex items-center gap-2 font-medium">
                <MapPin aria-hidden className="h-5 w-5 text-stone-400" />
                <span>{event.place.name}</span>
              </div>
              {event.place.address ? (
                <p className="ml-7 text-stone-600 dark:text-stone-300">
                  {getPlaceAddress(event.place)}
                </p>
              ) : null}

              {event.place.address && (
                <div className="mt-4">
                  <Button
                    as="a"
                    href={(() => {
                      if (event.place?.location?.lat && event.place?.location?.lng) {
                        const { lat, lng } = event.place.location;
                        return `https://maps.google.com/?q=${lat},${lng}`;
                      }
                      return `https://maps.google.com/?q=${encodeURIComponent(getPlaceAddress(event.place) || event.place?.name)}`;
                    })()}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="bordered"
                    endContent={<ExternalLink className="h-4 w-4" />}
                  >
                    {t('events.open-in-google-maps')}
                  </Button>
                </div>
              )}
            </div>
          ) : null}

          {event.website ? (
            <div className="mt-2 text-sm">
              <Button
                as="a"
                href={event.website}
                target="_blank"
                rel="noopener noreferrer"
                variant="flat"
                size="sm"
                endContent={<ExternalLink className="h-4 w-4" />}
              >
                {t('events.website')}
              </Button>
            </div>
          ) : null}
        </section>
      )}
      {event.place?.location?.lat && event.place?.location?.lng ? (
        <section aria-label="Map" className="rounded-2xl overflow-hidden border border-stone-300">
          <Map places={[event.place]} />
        </section>
      ) : null}

      {/* Share & Save */}
      <EventDetailsActions event={event} />
    </article>
  );
};

export default EventDetails;
