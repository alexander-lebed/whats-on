'use client';
import { cloneElement, FC, useMemo, useState } from 'react';
import { CalendarDate, parseDate, today, type DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';
import { endOfWeek, format, startOfToday } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CATEGORIES } from '@/app/constants';
import { useDarkMode } from '@/app/hooks';
import { useBreakpoint } from '@/app/hooks';
import { Button, DateRangePicker } from '@/app/ui';
import { eventDateOverlapsRange, calendarDateToIso } from '@/app/utils';
import type { EVENTS_QUERY_I18NResult } from '@/sanity/types';
import { EventsGrid } from './EventsGrid';

export type EventsExplorerProps = {
  events: EVENTS_QUERY_I18NResult;
};

export const EventsExplorer: FC<EventsExplorerProps> = ({ events }) => {
  const t = useTranslations();
  const { isMobile } = useBreakpoint();
  const { theme } = useDarkMode();
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

  // Preset handlers
  const handlePresetToday = () => {
    const todayDate = today('UTC');
    setDateRange({ start: todayDate, end: todayDate });
  };

  const handlePresetTomorrow = () => {
    const tomorrowDate = today('UTC').add({ days: 1 });
    setDateRange({ start: tomorrowDate, end: tomorrowDate });
  };

  const handlePresetThisWeek = () => {
    const todayDate = startOfToday();
    const weekEnd = endOfWeek(todayDate, { weekStartsOn: 1 }); // Sunday
    // Start from today, not the beginning of the week
    setDateRange({
      start: parseDate(format(todayDate, 'yyyy-MM-dd')),
      end: parseDate(format(weekEnd, 'yyyy-MM-dd')),
    });
  };

  const isLightMode = theme === 'light';
  const hasActiveFilters = selected.size > 0 || dateRange !== null;
  const isEmpty = filteredEvents.length === 0;

  return (
    <>
      <div className="mb-3 sm:mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('events.title')}</h1>
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[240px]">
          <DateRangePicker
            className="w-full min-w-2xs"
            label={t('events.when')}
            variant="flat"
            size={isMobile ? 'sm' : undefined}
            labelPlacement="inside"
            granularity="day"
            selectorIcon={<CalendarDays size="1em" />}
            value={dateRange}
            onChange={setDateRange}
            onClear={() => setDateRange(null)}
            minValue={minValue}
            visibleMonths={isMobile ? 1 : 2}
            firstDayOfWeek="mon"
            selectorButtonPlacement="start"
            classNames={{
              popoverContent: 'border border-default-200',
              inputWrapper: isLightMode ? 'outline outline-default-200' : undefined,
            }}
            CalendarBottomContent={
              <div className="flex flex-wrap gap-2 p-2 border-t border-default-200">
                <Button size="sm" variant="flat" onPress={handlePresetToday} className="text-xs">
                  {t('events.presets.today')}
                </Button>
                <Button size="sm" variant="flat" onPress={handlePresetTomorrow} className="text-xs">
                  {t('events.presets.tomorrow')}
                </Button>
                <Button size="sm" variant="flat" onPress={handlePresetThisWeek} className="text-xs">
                  {t('events.presets.this-week')}
                </Button>
              </div>
            }
          />
        </div>
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
                size={isMobile ? 'sm' : undefined}
                aria-label={t(category.i18n)}
                onPress={() => toggle(category.slug)}
                className={
                  isLightMode ? (isActive ? 'text-white' : 'outline-default-200') : undefined
                }
              >
                {cloneElement(category.iconComponent, { size: '1rem', 'aria-hidden': true })}
                <span>{t(category.i18n)}</span>
              </Button>
            );
          })}
        </div>
        {isEmpty ? (
          <div
            className="flex flex-col items-center justify-center py-10 text-center"
            role="status"
            aria-live="polite"
          >
            <p className="text-lg text-default-600">{t('events.empty-state.no-events')}</p>
            {hasActiveFilters && (
              <p className="mt-2 text-sm text-default-500">
                {t('events.empty-state.try-adjusting-filters')}
              </p>
            )}
          </div>
        ) : (
          <EventsGrid events={filteredEvents} />
        )}
      </div>
    </>
  );
};

export default EventsExplorer;
