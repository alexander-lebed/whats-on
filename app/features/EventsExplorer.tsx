'use client';
import { FC, useMemo, useState } from 'react';
import { CalendarDate, parseDate, type DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';
import { format, startOfToday } from 'date-fns';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useTranslations } from 'next-intl';
import { CATEGORIES } from '@/app/constants';
import { Button, DateRangePicker } from '@/app/ui';
import { eventDateOverlapsRange, calendarDateToIso } from '@/app/utils';
import type { EVENTS_QUERY_I18NResult } from '@/sanity/types';
import { EventsGrid } from './EventsGrid';

export type EventsExplorerProps = {
  events: EVENTS_QUERY_I18NResult;
};

export const EventsExplorer: FC<EventsExplorerProps> = ({ events }) => {
  const t = useTranslations();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);

  const toggle = (slug: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const filteredEvents = useMemo(() => {
    let result = events;

    // Filter by categories
    if (selected.size > 0) {
      result = result.filter(item => {
        if (!item.categories || item.categories.length === 0) {
          return false;
        }
        const itemSet = new Set(item.categories);
        for (const s of selected) {
          if (itemSet.has(s)) {
            return true;
          }
        }
        return false;
      });
    }

    // Filter by date range
    if (dateRange?.start && dateRange?.end) {
      // DateRangePicker with granularity="day" returns CalendarDate, but TypeScript types
      // use DateValue. Extract YYYY-MM-DD from the date value.
      const filterStart =
        dateRange.start instanceof CalendarDate
          ? calendarDateToIso(dateRange.start)
          : (String(dateRange.start).split('T')[0] ?? '');
      const filterEnd =
        dateRange.end instanceof CalendarDate
          ? calendarDateToIso(dateRange.end)
          : (String(dateRange.end).split('T')[0] ?? '');
      result = result.filter(item => {
        if (!item.schedule?.startDate) {
          return false;
        }
        return eventDateOverlapsRange(
          item.schedule.startDate,
          item.schedule.endDate,
          filterStart,
          filterEnd
        );
      });
    }

    return result;
  }, [events, selected, dateRange]);

  // Set the minimum date to today
  const minValue = parseDate(format(startOfToday(), 'yyyy-MM-dd'));

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('events.title')}</h1>
        <DateRangePicker
          className="w-full sm:w-auto sm:min-w-[240px]"
          label={t('events.when')}
          variant="flat"
          labelPlacement="inside"
          granularity="day"
          value={dateRange}
          onChange={setDateRange}
          minValue={minValue}
        />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map(category => {
            const isActive = selected.has(category.slug);
            return (
              <Button
                key={category.slug}
                variant={isActive ? 'solid' : 'flat'}
                color={isActive ? 'primary' : undefined}
                radius="full"
                aria-label={t(category.i18n)}
                onPress={() => toggle(category.slug)}
              >
                <DynamicIcon name={category.iconName} size="1rem" aria-hidden />
                <span>{t(category.i18n)}</span>
              </Button>
            );
          })}
        </div>
        <EventsGrid events={filteredEvents} />
      </div>
    </>
  );
};

export default EventsExplorer;
