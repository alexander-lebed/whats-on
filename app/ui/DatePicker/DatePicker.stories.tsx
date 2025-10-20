import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DatePicker } from '@/app/ui/DatePicker';
import { VARIANTS, SIZES, COLORS } from '@/app/ui/DatePicker/DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'UI/DatePicker',
  component: DatePicker,
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
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const AllStates: Story = {
  args: {
    label: 'Date',
    granularity: 'day',
  },
  render: args => (
    <div className="flex flex-col gap-6 w-[320px]">
      <DatePicker {...args} />
      <DatePicker {...args} isDisabled />
      <DatePicker {...args} isReadOnly />
      <DatePicker {...args} isRequired />
      <DatePicker {...args} granularity="minute" label="Date & time" />
    </div>
  ),
};

export const AllVariants: Story = {
  args: {
    label: 'Date',
    granularity: 'day',
    size: 'md',
  },
  render: args => (
    <div className="flex gap-5 flex-wrap w-[720px]">
      {VARIANTS.map(variant => (
        <div key={variant} className="w-[320px]">
          <DatePicker {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
};
