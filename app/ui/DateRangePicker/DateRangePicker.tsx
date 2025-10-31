'use client';

import { FC } from 'react';
import {
  DateRangePicker as HDateRangePicker,
  type DateRangePickerProps as HDateRangePickerProps,
} from '@heroui/date-picker';
import { cn } from '@/app/utils/cn';

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
  const { classNames, ...rest } = props;

  // Render a hollow circle (1-2px border, no fill) for selection edges.
  const selectedEdgeHollowCircle =
    '[&_[data-selected="true"][data-range-selection="true"][data-selection-start="true"]]:!bg-transparent ' +
    '[&_[data-selected="true"][data-range-selection="true"][data-selection-start="true"]]:border-2 ' +
    '[&_[data-selected="true"][data-range-selection="true"][data-selection-start="true"]]:border-primary ' +
    '[&_[data-selected="true"][data-range-selection="true"][data-selection-end="true"]]:!bg-transparent ' +
    '[&_[data-selected="true"][data-range-selection="true"][data-selection-end="true"]]:border-2 ' +
    '[&_[data-selected="true"][data-range-selection="true"][data-selection-end="true"]]:border-primary ';

  const mergedClassNames = {
    ...classNames,
    calendarContent: cn(selectedEdgeHollowCircle, classNames?.calendarContent),
  } as DateRangePickerProps['classNames'];

  return <HDateRangePicker {...rest} classNames={mergedClassNames} />;
};

export default DateRangePicker;
