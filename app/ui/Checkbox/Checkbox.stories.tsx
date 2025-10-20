import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Checkbox, CheckboxGroup } from '@/app/ui/Checkbox';
import { SIZES, COLORS } from '@/app/ui/Checkbox/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    color: { control: 'select', options: COLORS },
    size: { control: 'select', options: SIZES },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    isSelected: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const AllStates: Story = {
  args: {
    children: 'Accept terms and conditions',
  },
  render: args => (
    <div className="flex flex-col gap-8 w-[420px]">
      <div className="flex flex-col gap-4">
        <Checkbox {...args} />
        <Checkbox {...args} isDisabled>
          Disabled
        </Checkbox>
        <Checkbox {...args} isReadOnly>
          Read only
        </Checkbox>
        <Checkbox {...args} isRequired>
          Required
        </Checkbox>
        <Checkbox {...args} isSelected>
          Selected
        </Checkbox>
      </div>
      <CheckboxGroup label="Select fruits" defaultValue={['apple']}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="pear">Pear</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </CheckboxGroup>
    </div>
  ),
};
