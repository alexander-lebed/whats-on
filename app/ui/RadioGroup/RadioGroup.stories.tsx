import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RadioGroup, Radio } from '@/app/ui/RadioGroup';
import { SIZES, COLORS } from '@/app/ui/RadioGroup/RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: { control: 'select', options: SIZES },
    color: { control: 'select', options: COLORS },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
  },
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const AllStates: Story = {
  args: {
    label: 'Choose a plan',
    defaultValue: 'basic',
  },
  render: args => (
    <div className="flex flex-col gap-8 w-[420px]">
      <RadioGroup {...args}>
        <Radio value="basic">Basic</Radio>
        <Radio value="pro">Pro</Radio>
        <Radio value="enterprise">Enterprise</Radio>
      </RadioGroup>
      <RadioGroup {...args} isDisabled label="Disabled">
        <Radio value="basic">Basic</Radio>
        <Radio value="pro">Pro</Radio>
        <Radio value="enterprise">Enterprise</Radio>
      </RadioGroup>
      <RadioGroup {...args} orientation="horizontal" label="Horizontal">
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
        <Radio value="c">C</Radio>
      </RadioGroup>
    </div>
  ),
};
