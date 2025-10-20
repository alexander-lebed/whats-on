import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from '@/app/ui/Input';
import { VARIANTS, SIZES, COLORS } from '@/app/ui/Input/Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    color: { control: 'select', options: COLORS },
    size: { control: 'select', options: SIZES },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    isClearable: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    labelPlacement: {
      control: 'select',
      options: ['inside', 'outside', 'outside-left', 'outside-top'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'url', 'password', 'tel', 'search', 'file'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const AllStates: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    variant: 'flat',
    size: 'md',
    color: 'default',
    isClearable: true,
    description: 'We will never share your email.',
    errorMessage: 'Please enter a valid email.',
    type: 'email',
  },
  render: args => (
    <div className="flex flex-col gap-6 w-[360px]">
      <Input {...args} />
      <Input {...args} isInvalid />
      <Input {...args} isDisabled />
      <Input {...args} isReadOnly />
      <Input {...args} isRequired />
      <Input {...args} labelPlacement="outside" />
      <Input {...args} labelPlacement="outside-left" />
      <Input {...args} labelPlacement="outside-top" />
      <Input {...args} type="password" label="Password" placeholder="••••••••" />
    </div>
  ),
};

export const AllVariants: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    size: 'md',
  },
  render: args => (
    <div className="flex gap-5 flex-wrap w-[720px]">
      {VARIANTS.map(variant => (
        <div key={variant} className="w-[320px]">
          <Input {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
};
