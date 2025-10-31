'use client';

import { FC } from 'react';
import {
  DateRangePicker as HDateRangePicker,
  type DateRangePickerProps as HDateRangePickerProps,
} from '@heroui/date-picker';

export type DateRangePickerProps = HDateRangePickerProps;

export const VARIANTS: DateRangePickerProps['variant'][] = [
  'flat',
  'bordered',
  'faded',
  'underlined',
];
export const SIZES: DateRangePickerProps['size'][] = ['sm', 'md', 'lg'];
export const COLORS: DateRangePickerProps['color'][] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];

const DateRangePicker: FC<DateRangePickerProps> = props => {
  return <HDateRangePicker {...props} />;
};

export default DateRangePicker;
