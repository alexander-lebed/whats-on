'use client';

import { FC } from 'react';
import {
  DatePicker as HDatePicker,
  type DatePickerProps as HDatePickerProps,
} from '@heroui/date-picker';

export type DatePickerProps = HDatePickerProps;

export const VARIANTS: DatePickerProps['variant'][] = ['flat', 'bordered', 'faded', 'underlined'];
export const SIZES: DatePickerProps['size'][] = ['sm', 'md', 'lg'];
export const COLORS: DatePickerProps['color'][] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];

const DatePicker: FC<DatePickerProps> = props => {
  return <HDatePicker {...props} />;
};

export default DatePicker;
