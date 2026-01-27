'use client';

import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Event, Locale } from '@/app/types';
import { Button } from '@/app/ui';
import { getScheduleOccurrences, cn } from '@/app/utils';
import { getDateFnsLocale } from '@/app/utils/date';

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

  const initialVisibleCount = 6;
  const visible = expanded ? allOccurrences : allOccurrences.slice(0, initialVisibleCount);
  const hasMore = allOccurrences.length > initialVisibleCount;

  // Group visible occurrences by month
  const groupedOccurrences = useMemo(() => {
    const groups: { month: string; items: typeof visible }[] = [];
    visible.forEach(item => {
      const monthLabel = format(item.date, 'MMMM yyyy', {
        locale: getDateFnsLocale(locale),
      });
      const existingGroup = groups.find(g => g.month === monthLabel);
      if (existingGroup) {
        existingGroup.items.push(item);
      } else {
        groups.push({ month: monthLabel, items: [item] });
      }
    });
    return groups;
  }, [visible, locale]);

  if (allOccurrences.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="dates-heading" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 id="dates-heading" className="text-2xl font-bold text-foreground">
          {t('events.all-dates')}
        </h2>
      </div>

      <div className="space-y-4">
        {groupedOccurrences.map(group => (
          <div key={group.month} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.items.map((o, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex flex-col gap-1 p-3 rounded-2xl border',
                    'bg-white/50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-800'
                  )}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                      {format(o.date, 'd MMM')}
                    </span>
                    <span className=" text-stone-500 dark:text-stone-400">
                      {format(o.date, '(EEE)', { locale: getDateFnsLocale(locale) })}
                    </span>
                  </div>
                  {o.time && (
                    <div className="text-sm tabular-nums text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 opacity-60" />
                      {o.time}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {hasMore && (
          <div className="flex justify-start">
            <Button
              variant="flat"
              onPress={() => setExpanded(prev => !prev)}
              endContent={
                expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
              }
            >
              {expanded ? t('events.show-less-dates') : t('events.show-all-dates')}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventDetailsDates;
