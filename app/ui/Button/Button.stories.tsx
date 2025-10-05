import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, VARIANTS, SIZES } from '@/app/ui/Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: SIZES,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const AllVariants: Story = {
  args: {
    size: 'default',
  },
  render: args => (
    <div className="flex gap-5 flex-wrap">
      {VARIANTS.map(variant => (
        <Button key={variant} variant={variant} size={args.size}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
