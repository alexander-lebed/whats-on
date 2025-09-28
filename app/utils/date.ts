import { parseISO, isSameDay, format } from 'date-fns';
import { enUS, es as esLocale } from 'date-fns/locale';
import type { Locale } from '@/app/types';

// Format schedule dates like "Apr 5 – Apr 7". Accepts YYYY-MM-DD.
export const formatDateRange = (start: string, end?: string): string => {
  const s = parseISO(`${start}T00:00:00Z`);
  const e = end ? parseISO(`${end}T00:00:00Z`) : undefined;
  const startStr = format(s, 'MMM d');
  if (!e) {
    return startStr;
  }
  return isSameDay(s, e) ? startStr : `${startStr} – ${format(e, 'MMM d')}`;
};

export const getDateFnsLocale = (locale: Locale) => (locale === 'es' ? esLocale : enUS);

export const formatDayShort = (isoDate: string, locale: Locale) => {
  try {
    const d = parseISO(`${isoDate}T00:00:00Z`);
    return format(d, 'd MMM', { locale: getDateFnsLocale(locale) });
  } catch {
    return isoDate;
  }
};
