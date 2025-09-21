import { useEffect } from 'react';
import { addDays, parseISO, format, parse, isAfter } from 'date-fns';
import type { ObjectInputProps } from 'sanity';
import { set } from 'sanity';

type ScheduleValue = {
  mode?: 'single' | 'range';
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
};

const toNextDay = (yyyyMMdd: string): string => {
  return format(addDays(parseISO(`${yyyyMMdd}T00:00:00Z`), 1), 'yyyy-MM-dd');
};

// Schedule object input that auto-computes endDate in single mode
export default function ScheduleInput(props: ObjectInputProps<ScheduleValue>) {
  const { value, onChange } = props;

  useEffect(() => {
    if (!value) {
      return;
    }
    const mode = value.mode ?? 'single';
    if (mode !== 'single') {
      return;
    } // only compute for single

    const { startDate, startTime, endTime } = value;
    if (!startDate || !startTime || !endTime) {
      return;
    }

    const base = new Date(0);
    const s = parse(startTime, 'HH:mm', base);
    const e = parse(startTime, 'HH:mm', base);
    const next = isAfter(e, s) ? startDate : toNextDay(startDate);
    if (next !== value.endDate) {
      onChange(set(next, ['endDate']));
    }
  }, [value, onChange]);

  // Render default object fields
  return props.renderDefault(props);
}
