import { CalendarDate, parseDate } from '@internationalized/date';
import { parseISO, isAfter, isBefore, isEqual } from 'date-fns';

/**
 * Converts an ISO date string (YYYY-MM-DD) to a CalendarDate
 */
export const isoToCalendarDate = (isoDate: string): CalendarDate => {
  return parseDate(isoDate);
};

/**
 * Converts a CalendarDate to an ISO date string (YYYY-MM-DD)
 */
export const calendarDateToIso = (date: CalendarDate): string => {
  return date.toString();
};

/**
 * Checks if an event date range overlaps with a filter date range
 * An event overlaps if:
 * - Event starts before or on filter end date AND
 * - Event ends after or on filter start date (or has no end date)
 */
export const eventDateOverlapsRange = (
  eventStartDate: string,
  eventEndDate: string | undefined,
  filterStartDate: string,
  filterEndDate: string
): boolean => {
  const eventStart = parseISO(`${eventStartDate}T00:00:00Z`);
  const eventEnd = eventEndDate ? parseISO(`${eventEndDate}T00:00:00Z`) : eventStart;
  const filterStart = parseISO(`${filterStartDate}T00:00:00Z`);
  const filterEnd = parseISO(`${filterEndDate}T00:00:00Z`);

  // Event overlaps if:
  // - Event starts before or on filter end date AND
  // - Event ends after or on filter start date
  return (
    (isBefore(eventStart, filterEnd) || isEqual(eventStart, filterEnd)) &&
    (isAfter(eventEnd, filterStart) || isEqual(eventEnd, filterStart))
  );
};
