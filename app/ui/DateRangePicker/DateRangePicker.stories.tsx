import { useState } from 'react';
import { today, getLocalTimeZone, type DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DateRangePicker } from '@/app/ui/DateRangePicker';
import { VARIANTS, SIZES, COLORS } from '@/app/ui/DateRangePicker/DateRangePicker';

const meta: Meta<typeof DateRangePicker> = {
  title: 'UI/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'select', options: SIZES },
    color: { control: 'select', options: COLORS },
    granularity: {
      control: 'select',
      options: ['day', 'hour', 'minute', 'second'],
    },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    showMonthAndYearPickers: { control: 'boolean' },
    hourCycle: { control: 'select', options: [12, 24] },
    visibleMonths: { control: 'number', min: 1, max: 3 },
    firstDayOfWeek: {
      control: 'select',
      options: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    },
    pageBehavior: { control: 'select', options: ['single', 'visible'] },
    labelPlacement: {
      control: 'select',
      options: ['inside', 'outside', 'outside-left'],
    },
    selectorButtonPlacement: { control: 'select', options: ['start', 'end'] },
    allowsNonContiguousRanges: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof DateRangePicker>;

export const AllStates: Story = {
  args: {
    label: 'Date Range',
    granularity: 'day',
  },
  render: args => (
    <div className="flex flex-col gap-6 w-[640px]">
      <DateRangePicker {...args} />
      <DateRangePicker {...args} isDisabled />
      <DateRangePicker {...args} isReadOnly />
      <DateRangePicker {...args} isRequired />
      <DateRangePicker {...args} granularity="minute" label="Date & Time Range" />
    </div>
  ),
};

export const AllVariants: Story = {
  args: {
    label: 'Date Range',
    granularity: 'day',
    size: 'md',
  },
  render: args => (
    <div className="flex flex-col gap-5 w-[720px]">
      {VARIANTS.map(variant => (
        <div key={variant} className="w-[640px]">
          <DateRangePicker {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
};

export const WithTimeFields: Story = {
  args: {
    label: 'Date & Time Range',
    granularity: 'minute',
  },
  render: args => (
    <div className="w-[640px]">
      <DateRangePicker {...args} />
    </div>
  ),
};

export const MultipleMonths: Story = {
  args: {
    label: 'Date Range',
    granularity: 'day',
    visibleMonths: 2,
  },
  render: args => (
    <div className="w-[640px]">
      <DateRangePicker {...args} />
    </div>
  ),
};

export const WithDescription: Story = {
  args: {
    label: 'Date Range',
    granularity: 'day',
    description: 'Select a date range for your event',
  },
  render: args => (
    <div className="w-[640px]">
      <DateRangePicker {...args} />
    </div>
  ),
};

export const WithErrorMessage: Story = {
  args: {
    label: 'Date Range',
    granularity: 'day',
    isInvalid: true,
    errorMessage: 'Please select a valid date range',
  },
  render: args => (
    <div className="w-[640px]">
      <DateRangePicker {...args} />
    </div>
  ),
};

export const WithMonthAndYearPickers: Story = {
  args: {
    label: 'Date Range',
    granularity: 'day',
    showMonthAndYearPickers: true,
  },
  render: args => (
    <div className="w-[640px]">
      <DateRangePicker {...args} />
    </div>
  ),
};

export const CustomFirstDayOfWeek: Story = {
  args: {
    label: 'Date Range',
    granularity: 'day',
    firstDayOfWeek: 'mon',
  },
  render: args => (
    <div className="w-[640px]">
      <DateRangePicker {...args} />
    </div>
  ),
};

export const SelectorButtonPlacement: Story = {
  args: {
    label: 'Date Range',
    granularity: 'day',
  },
  render: args => (
    <div className="flex flex-col gap-5 w-[720px]">
      <div className="w-[640px]">
        <DateRangePicker {...args} selectorButtonPlacement="start" />
      </div>
      <div className="w-[640px]">
        <DateRangePicker {...args} selectorButtonPlacement="end" />
      </div>
    </div>
  ),
};

export const LabelPlacements: Story = {
  args: {
    label: 'Date Range',
    granularity: 'day',
    size: 'md',
  },
  render: args => (
    <div className="flex flex-col gap-5 w-[720px]">
      {(['inside', 'outside', 'outside-left'] as const).map(placement => (
        <div key={placement} className="w-[640px]">
          <DateRangePicker {...args} labelPlacement={placement} />
        </div>
      ))}
    </div>
  ),
};

const ClearableTemplate = () => {
  const [value, setValue] = useState<RangeValue<DateValue> | null>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ days: 7 }),
  });

  return (
    <div className="flex flex-col gap-4 w-[640px]">
      <DateRangePicker
        label="Clearable Date Range"
        granularity="day"
        value={value}
        onChange={setValue}
        onClear={() => setValue(null)}
      />
      <p className="text-sm text-default-500">
        Selected: {value ? `${value.start} – ${value.end}` : 'None'}
      </p>
    </div>
  );
};

export const Clearable: Story = {
  render: () => <ClearableTemplate />,
};
