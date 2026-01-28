'use client';

import type { MouseEvent } from 'react';
import { useState } from 'react';
import { parseDate, today, type DateValue } from '@internationalized/date';
import { RangeValue } from '@react-types/shared';
import { endOfWeek, format, startOfToday } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useBreakpoint } from '@/app/hooks';
import { Button, DateRangePicker, DateRangePickerProps } from '@/app/ui';

type Props = Pick<DateRangePickerProps, 'value'> & {
  value: RangeValue<DateValue> | null;
  onChange: (value: RangeValue<DateValue> | null) => void;
};

const EventsDateRangePicker = ({ value, onChange }: Props) => {
  const t = useTranslations();
  const { isMobile } = useBreakpoint();
  const [isOpen, setIsOpen] = useState(false);

  // Set the minimum date to today
  const minValue = parseDate(format(startOfToday(), 'yyyy-MM-dd'));

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleContainerClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange(null);
  };

  const handleFocus = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  // Preset handlers
  const handlePresetToday = () => {
    const todayDate = today('UTC');
    onChange({ start: todayDate, end: todayDate });
  };

  const handlePresetTomorrow = () => {
    const tomorrowDate = today('UTC').add({ days: 1 });
    onChange({ start: tomorrowDate, end: tomorrowDate });
  };

  const handlePresetThisWeek = () => {
    const todayDate = startOfToday();
    const weekEnd = endOfWeek(todayDate, { weekStartsOn: 1 }); // Sunday
    // Start from today, not the beginning of the week
    onChange({
      start: parseDate(format(todayDate, 'yyyy-MM-dd')),
      end: parseDate(format(weekEnd, 'yyyy-MM-dd')),
    });
  };

  return (
    <DateRangePicker
      className="w-full min-w-2xs"
      isOpen={isOpen}
      label={t('events.when')}
      variant="flat"
      labelPlacement="inside"
      granularity="day"
      selectorIcon={<CalendarDays size="1em" />}
      onContainerClick={handleContainerClick}
      onOpenChange={handleOpenChange}
      onFocus={handleFocus}
      value={value}
      onChange={onChange}
      onClear={handleClear}
      minValue={minValue}
      visibleMonths={isMobile ? 1 : 2}
      firstDayOfWeek="mon"
      selectorButtonPlacement="start"
      classNames={{
        popoverContent: 'border border-default-200',
        label: 'cursor-pointer',
        inputWrapper: 'cursor-pointer outline outline-default-200 dark:outline-0',
        input: value ? '' : 'hidden',
        separator: value ? '' : 'hidden',
      }}
      CalendarBottomContent={
        <div className="flex flex-wrap gap-2 p-2 border-t border-default-200">
          <Button size="sm" variant="flat" onPress={handlePresetToday} className="text-xs">
            {t('events.presets.today')}
          </Button>
          <Button size="sm" variant="flat" onPress={handlePresetTomorrow} className="text-xs">
            {t('events.presets.tomorrow')}
          </Button>
          <Button size="sm" variant="flat" onPress={handlePresetThisWeek} className="text-xs">
            {t('events.presets.this-week')}
          </Button>
        </div>
      }
    />
  );
};

export default EventsDateRangePicker;
