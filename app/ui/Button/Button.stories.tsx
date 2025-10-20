import type { ButtonProps } from '@heroui/button';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/app/ui/Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'bordered', 'flat', 'ghost', 'light', 'faded', 'shadow'],
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
      {(
        ['solid', 'bordered', 'flat', 'ghost', 'light', 'faded', 'shadow'] as NonNullable<
          ButtonProps['variant']
        >[]
      ).map(variant => (
        <Button key={variant} variant={variant} size={args.size}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
