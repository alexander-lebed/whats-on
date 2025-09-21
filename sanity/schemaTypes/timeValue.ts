import { defineType } from 'sanity';

// String type constrained to 24h HH:mm options, ordered from 07:00 → 06:30
// (wrap across midnight) in 30-minute increments.
const ALLOWED_TIMES = (): string[] => {
  const times: string[] = [];
  const slots = 48; // 24 hours / 30 min
  // start at 07:00 (in minutes)
  let minutes = 7 * 60;
  for (let i = 0; i < slots; i += 1) {
    const total = minutes % (24 * 60);
    const h = Math.floor(total / 60);
    const m = total % 60;
    times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    minutes += 30;
  }
  return times;
};

export default defineType({
  name: 'timeValue',
  title: 'Time',
  type: 'string',
  options: {
    list: ALLOWED_TIMES(),
  },
});
