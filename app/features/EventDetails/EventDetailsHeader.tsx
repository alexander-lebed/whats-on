import { FC, ReactElement, cloneElement, isValidElement } from 'react';
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
    <header>
      <h1 className="mb-3 font-bold tracking-tight text-3xl sm:text-4xl">{event.title}</h1>
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        {event.categories?.length ? (
          <div className="flex items-center gap-3">
            {event.categories.map(slug => {
              const cat = CATEGORIES.find(c => c.slug === slug);
              if (!cat) {
                return null;
              }
              return (
                <span key={slug} className="inline-flex items-center gap-2">
                  <span aria-hidden>
                    {isValidElement(cat.iconComponent)
                      ? cloneElement(cat.iconComponent as ReactElement<{ size: string }>, {
                          size: '1.1em',
                        })
                      : cat.iconComponent}
                  </span>
                  <span className="align-middle">{t(cat.i18n)}</span>
                </span>
              );
            })}
          </div>
        ) : null}
        {event.place?.title ? (
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-sm">
              <MapPin size="1.3em" />
            </span>
            <span>{event.place.title}</span>
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
                {event.schedule.startTime}
                {event.schedule.endTime ? ` – ${event.schedule.endTime}` : ''}
              </span>
            ) : (
              <span>
                {formatDayShort(event.schedule.startDate, locale)}
                {` – ${formatDayShort(event.schedule.endDate, locale)}, `}
                {event.schedule.startTime}
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
