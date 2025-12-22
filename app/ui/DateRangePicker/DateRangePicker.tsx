'use client';

import { FC } from 'react';
import {
  DateRangePicker as HDateRangePicker,
  type DateRangePickerProps as HDateRangePickerProps,
} from '@heroui/date-picker';
import { X } from 'lucide-react';
import { cn } from '@/app/utils/cn';

export type DateRangePickerProps = HDateRangePickerProps & {
  onClear?: () => void;
};

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
  const { classNames, onClear, onChange, value, ...rest } = props;

  const hasValue = value !== null && value !== undefined;
  const showClearButton = onClear && hasValue;

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

  return (
    <div className="relative">
      <HDateRangePicker {...rest} value={value} onChange={onChange} classNames={mergedClassNames} />
      {showClearButton && (
        <button
          type="button"
          aria-label="Clear date range"
          onClick={onClear}
          className={cn(
            'absolute right-1.5 top-1/2 -translate-y-1/2 z-10 cursor-pointer',
            'flex items-center justify-center',
            'w-6 h-6 rounded-full',
            'text-default-400 hover:text-default-600',
            'hover:bg-default-100',
            'transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
          )}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default DateRangePicker;
