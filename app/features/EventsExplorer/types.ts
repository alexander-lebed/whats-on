import type { DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';

export type EventFilters = {
  categories: Set<string>;
  dateRange: RangeValue<DateValue> | null;
};