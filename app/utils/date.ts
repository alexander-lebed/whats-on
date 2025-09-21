import { parseISO, isSameDay, format } from 'date-fns';

// Format schedule dates like "Apr 5 – Apr 7". Accepts YYYY-MM-DD.
export const formatDateRange = (start: string, end?: string): string => {
  const s = parseISO(`${start}T00:00:00Z`);
  const e = end ? parseISO(`${end}T00:00:00Z`) : undefined;
  const startStr = format(s, 'MMM d');
  if (!e) return startStr;
  return isSameDay(s, e) ? startStr : `${startStr} – ${format(e, 'MMM d')}`;
};
