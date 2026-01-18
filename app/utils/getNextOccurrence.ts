import { isToday, isBefore, parseISO, addDays, format, startOfDay } from 'date-fns';
import type { Event } from '@/app/types';

type NextOccurrence = {
  date: string;
  isToday: boolean;
};

/**
 * Finds the next occurrence date for an event schedule.
 * Returns "today" if the event is happening today, otherwise the next available date.
 * Falls back to the original start date if all occurrences are in the past.
 */
export const getNextOccurrence = (schedule: Event['schedule']): NextOccurrence | null => {
  if (!schedule?.startDate) {
    return null;
  }

  const today = startOfDay(new Date());
  const start = parseISO(`${schedule.startDate}T00:00:00Z`);
  const end = schedule.endDate ? parseISO(`${schedule.endDate}T00:00:00Z`) : start;
  const weekdayFilter = schedule.weekdays?.length ? new Set(schedule.weekdays) : null;

  // Start from today or schedule start, whichever is later
  let cursor = isBefore(today, start) ? start : today;

  // Check up to end date (with a safety cap to prevent infinite loops)
  const maxIterations = 366;
  let iterations = 0;

  while (!isBefore(end, cursor) && iterations < maxIterations) {
    const weekday = format(cursor, 'eee').toLowerCase();
    if (!weekdayFilter || weekdayFilter.has(weekday)) {
      return {
        date: format(cursor, 'yyyy-MM-dd'),
        isToday: isToday(cursor),
      };
    }
    cursor = addDays(cursor, 1);
    iterations++;
  }

  // No future occurrences - fallback to start date
  return { date: schedule.startDate, isToday: false };
};
