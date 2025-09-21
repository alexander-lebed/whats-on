import { useEffect } from 'react';
import type { ObjectInputProps } from 'sanity';
import { set } from 'sanity';

type ScheduleValue = {
  mode?: 'single' | 'range';
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
};

const parseMinutes = (hhmm?: string): number | null => {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(':');
  const hour = Number(h);
  const minute = Number(m);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return hour * 60 + minute;
};

const addOneDay = (yyyyMMdd: string): string => {
  const d = new Date(`${yyyyMMdd}T00:00:00Z`);
  // add 1 day in UTC to avoid TZ shifts; backend stores date only
  d.setUTCDate(d.getUTCDate() + 1);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Schedule object input that auto-computes endDate in single mode
export default function ScheduleInput(props: ObjectInputProps<ScheduleValue>) {
  const { value, onChange } = props;

  useEffect(() => {
    const mode = value?.mode ?? 'single';
    if (mode !== 'single') return; // only compute for single

    const startDate = value?.startDate;
    const startMin = parseMinutes(value?.startTime);
    const endMin = parseMinutes(value?.endTime);
    if (!startDate || startMin == null || endMin == null) return;

    const next = endMin <= startMin ? addOneDay(startDate) : startDate;
    if (next !== value?.endDate) {
      onChange(set(next, ['endDate']));
    }
  }, [value?.mode, value?.startDate, value?.startTime, value?.endTime, value?.endDate, onChange]);

  // Render default object fields
  return props.renderDefault(props);
}
