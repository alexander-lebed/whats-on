import { cloneElement, FC } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CATEGORIES } from '@/app/constants';
import { Event, Locale } from '@/app/types';
import { formatDayShort } from '@/app/utils';

type Props = {
  event: Event;
  locale: Locale;
};

const EventDetailsHeader: FC<Props> = ({ event, locale }) => {
  const t = useTranslations();
  return (
    <header className="flex flex-col gap-4">
      <h1 className="font-bold tracking-tight text-3xl sm:text-5xl leading-tight text-foreground">
        {event.title}
      </h1>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {event.categories?.length ? (
          <div className="flex flex-wrap items-center gap-2">
            {event.categories.map(slug => {
              const cat = CATEGORIES.find(c => c.slug === slug);
              if (!cat) {
                return null;
              }
              return (
                <span
                  key={slug}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                >
                  <span aria-hidden>
                    {cloneElement(cat.iconComponent, { size: '1em', 'aria-hidden': true })}
                  </span>
                  <span>{t(cat.i18n)}</span>
                </span>
              );
            })}
          </div>
        ) : null}
        {event.place?.name ? (
          <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
            <span aria-hidden className="text-stone-400 dark:text-stone-500">
              <MapPin size="1.2em" />
            </span>
            <span className="font-medium text-sm sm:text-base">{event.place.name}</span>
          </div>
        ) : null}
        {event.schedule ? (
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-sm">
              <Calendar size="1.3em" />
            </span>
            {event.schedule.mode === 'single' || !event.schedule.endDate ? (
              <span>
                {formatDayShort(event.schedule.startDate, locale)}
                {event.schedule.startTime || event.schedule.endTime ? ', ' : ''}
                {event.schedule.startTime ?? ''}
                {event.schedule.endTime ? ` – ${event.schedule.endTime}` : ''}
              </span>
            ) : (
              <span>
                {formatDayShort(event.schedule.startDate, locale)}
                {` – ${formatDayShort(event.schedule.endDate, locale)}`}
                {event.schedule.startTime || event.schedule.endTime ? ', ' : ''}
                {event.schedule.startTime ?? ''}
                {event.schedule.endTime ? ` – ${event.schedule.endTime}` : ''}
              </span>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default EventDetailsHeader;
