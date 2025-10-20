import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/app/ui/Button';
import { COLORS, SIZES, VARIANTS } from '@/app/ui/Button/Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
    },
    size: {
      control: 'select',
      options: SIZES,
    },
    color: {
      control: 'select',
      options: COLORS,
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const AllVariants: Story = {
  args: {
    size: 'md',
  },
  render: args => (
    <div className="flex gap-5 flex-wrap">
      {VARIANTS.map(variant => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
