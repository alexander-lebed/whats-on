import { useMemo } from 'react';
import { CalendarDate } from '@internationalized/date';
import { EventFilters } from '@/app/features/EventsExplorer/types';
import { Event } from '@/app/types';
import { calendarDateToIso, eventDateOverlapsRange } from '@/app/utils';

type Params = {
  events: Event[];
  filters: EventFilters;
};

export const useFilteredEvents = ({ events, filters }: Params): Event[] => {
  return useMemo(() => {
    let result = events;

    const { categories, dateRange } = filters;

    // Filter by categories
    if (categories.size > 0) {
      result = result.filter(item => {
        if (!item.categories || item.categories.length === 0) {
          return false;
        }
        const itemSet = new Set(item.categories);
        for (const s of categories) {
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
  }, [events, filters]);
};
