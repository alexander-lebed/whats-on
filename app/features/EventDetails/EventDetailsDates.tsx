'use client';

import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Event, Locale } from '@/app/types';
import { getScheduleOccurrences } from '@/app/utils';

type EventDatesProps = {
  schedule: Event['schedule'];
  locale: Locale;
};

const EventDetailsDates: FC<EventDatesProps> = ({ schedule, locale }) => {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);
  const allOccurrences = useMemo(
    () => getScheduleOccurrences(schedule, locale),
    [schedule, locale]
  );
  const visible = expanded ? allOccurrences : allOccurrences.slice(0, 3);
  const hasMore = allOccurrences.length > 3;

  if (allOccurrences.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="dates-heading"
      className="rounded-3xl border border-stone-200 bg-stone-100/50 p-6 dark:border-none dark:bg-transparent dark:p-0"
    >
      <h2 id="dates-heading" className="mb-1 text-lg font-bold text-foreground">
        {t('events.all-dates')}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-auto border-separate border-spacing-y-2">
          <caption className="sr-only">{t('events.all-dates')}</caption>
          <tbody>
            {visible.map((o, idx) => (
              <tr key={idx} className="align-middle">
                <td className="pr-10 whitespace-nowrap font-medium">{o.label}</td>
                <td className="text-right tabular-nums whitespace-nowrap text-stone-600 dark:text-stone-400">
                  {o.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && !expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="mt-3 font-medium text-primary hover:underline cursor-pointer disabled:opacity-50"
        >
          {t('events.show-all-dates')}
        </button>
      ) : null}
    </section>
  );
};

export default EventDetailsDates;
