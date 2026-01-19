import { addDays, format, isBefore, isEqual, parseISO } from 'date-fns';
import { Event, Locale } from '@/app/types';
import { getDateFnsLocale } from './date';

export const getScheduleOccurrences = (
  schedule: Event['schedule'],
  locale: Locale
): Array<{ label: string; time: string; date: Date }> => {
  if (!schedule) {
    return [];
  }
  const { startTime, endTime } = schedule;
  const timeLabel = startTime && endTime ? `${startTime} – ${endTime}` : (startTime ?? '');

  if (schedule.mode === 'single' || !schedule.endDate) {
    const date = parseISO(`${schedule.startDate}T00:00:00Z`);
    return [
      {
        label: format(date, 'd MMM (EEE)', {
          locale: getDateFnsLocale(locale),
        }),
        time: timeLabel,
        date,
      },
    ];
  }

  const start = parseISO(`${schedule.startDate}T00:00:00Z`);
  const end = parseISO(`${schedule.endDate}T00:00:00Z`);
  const preferred: Set<string> | null = schedule.weekdays?.length
    ? new Set(schedule.weekdays)
    : null;

  const out: Array<{ label: string; time: string; date: Date }> = [];
  let cursor = start;
  const hardCap = 366;
  while ((isBefore(cursor, end) || isEqual(cursor, end)) && out.length < hardCap) {
    const weekday = format(cursor, 'eee').toLowerCase();
    const include = preferred ? preferred.has(weekday) : true;
    if (include) {
      out.push({
        label: format(cursor, 'd MMM (EEE)', { locale: getDateFnsLocale(locale) }),
        time: timeLabel,
        date: new Date(cursor),
      });
    }
    cursor = addDays(cursor, 1);
  }
  return out;
};
