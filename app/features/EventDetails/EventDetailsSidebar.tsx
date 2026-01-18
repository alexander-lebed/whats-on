import type { FC } from 'react';
import { Calendar, ExternalLink, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Event, Locale } from '@/app/types';
import Button from '@/app/ui/Button/Button';
import { formatDayShort, getNextOccurrence, getPlaceAddress } from '@/app/utils';

type Props = {
  event: Event;
  locale: Locale;
};

/** Builds a Google Maps URL for a given place */
const getGoogleMapsUrl = (place: Event['place']): string => {
  if (place?.location?.lat && place?.location?.lng) {
    return `https://maps.google.com/?q=${place.location.lat},${place.location.lng}`;
  }
  return `https://maps.google.com/?q=${encodeURIComponent(getPlaceAddress(place) || place?.name || '')}`;
};

const EventDetailsSidebar: FC<Props> = ({ event, locale }) => {
  const t = useTranslations();
  const placeAddress = getPlaceAddress(event.place);
  const nextOccurrence = getNextOccurrence(event.schedule);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900/50">
        {/* When */}
        {event.schedule && (
          <div className="mb-6 flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">
                {nextOccurrence?.isToday
                  ? t('events.presets.today')
                  : nextOccurrence?.date
                    ? formatDayShort(nextOccurrence.date, locale, true)
                    : ''}
              </h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm">
                {event.schedule.startTime || event.schedule.endTime ? (
                  <>
                    {event.schedule.startTime ?? ''}
                    {event.schedule.endTime ? ` – ${event.schedule.endTime}` : ''}
                  </>
                ) : (
                  <span>{t('events.all-day')}</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Price or Free */}
        <div className="mb-6">
          {event.isFree ? (
            <div className="text-2xl font-bold text-foreground">{t('events.free')}</div>
          ) : event.price ? (
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground">
                {new Intl.NumberFormat(locale, {
                  style: 'currency',
                  currency: 'EUR',
                }).format(event.price)}
              </span>
              <span className="text-sm text-stone-500">{t('events.min-price')}</span>
            </div>
          ) : null}
        </div>

        {/* Tickets */}
        {event.ticketUrl && (
          <Button
            as="a"
            className="w-full font-semibold text-white shadow-md shadow-orange-500/20"
            href={event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            variant="solid"
            endContent={<ExternalLink className="h-4 w-4" />}
          >
            {t('events.tickets')}
          </Button>
        )}

        {/* Website */}
        {event.website && (
          <div className="mt-4">
            <Button
              as="a"
              className="w-full"
              href={event.website}
              target="_blank"
              rel="noopener noreferrer"
              variant="flat"
              size="sm"
              endContent={<ExternalLink className="h-3.5 w-3.5" />}
            >
              {t('events.website')}
            </Button>
          </div>
        )}
      </div>

      {/* Getting there */}
      {event.place && (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900/50">
          <h3 className="mb-2 font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-stone-400" />
            {t('events.getting-there')}
          </h3>
          <div className="text-sm text-stone-600 dark:text-stone-400 mb-3">
            <span className="font-medium text-foreground block mb-1">{event.place.name}</span>
            {placeAddress && <span>{placeAddress}</span>}
          </div>

          {(event.place.address || event.place.location) && (
            <Button
              as="a"
              className="w-full"
              href={getGoogleMapsUrl(event.place)}
              target="_blank"
              rel="noopener noreferrer"
              variant="flat"
              size="sm"
              endContent={<ExternalLink className="h-3.5 w-3.5" />}
            >
              {t('events.open-in-google-maps')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventDetailsSidebar;
