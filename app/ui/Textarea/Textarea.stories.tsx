import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Textarea } from '@/app/ui/Textarea';
import { VARIANTS, SIZES, COLORS } from '@/app/ui/Textarea/Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    color: { control: 'select', options: COLORS },
    size: { control: 'select', options: SIZES },
    isClearable: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    disableAutosize: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const AllStates: Story = {
  args: {
    label: 'Description',
    placeholder: 'Write a short description...',
    variant: 'flat',
    size: 'md',
    color: 'default',
    description: 'Max 500 characters.',
    errorMessage: 'Too long.',
  },
  render: args => (
    <div className="flex flex-col gap-6 w-[480px]">
      <Textarea {...args} />
      <Textarea {...args} isInvalid />
      <Textarea {...args} isDisabled />
      <Textarea {...args} isRequired />
      <Textarea {...args} disableAutosize />
    </div>
  ),
};

export const AllVariants: Story = {
  args: {
    label: 'Label',
    placeholder: 'Write here...',
    size: 'md',
  },
  render: args => (
    <div className="flex gap-5 flex-wrap w-[960px]">
      {VARIANTS.map(variant => (
        <div key={variant} className="w-[420px]">
          <Textarea {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
};
