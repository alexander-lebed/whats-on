import { ButtonHTMLAttributes, Ref } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/utils';

export const VARIANTS = ['default', 'destructive', 'outline', 'link', 'filter'] as const;

export const SIZES = ['default', 'sm', 'lg', 'icon'] as const;

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90 active:bg-primary',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-primary bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:bg-primary active:text-primary-foreground active:border-primary',
        link: 'text-primary underline-offset-4 hover:underline',
        filter: [
          'border',
          'border-foreground/15',
          'bg-foreground/5',
          'text-foreground',
          'hover:bg-foreground/10',
          'hover:border-primary',
          'focus-visible:border-primary',
          'focus-visible:ring-0',
        ].join(' '),
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
      active: {
        true: '',
        false: '',
      },
      rounded: {
        true: 'rounded-full',
        false: 'rounded-md',
      },
    },
    compoundVariants: [
      {
        variant: 'filter',
        active: true,
        className: [
          'bg-primary',
          'text-primary-foreground',
          'border-primary',
          'hover:bg-primary',
          'hover:text-primary-foreground',
          'hover:border-primary',
          'focus:bg-primary',
          'focus:text-primary-foreground',
          'focus:border-primary',
        ],
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: true,
      active: false,
    },
  }
);

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    ref?: Ref<HTMLButtonElement>;
    asChild?: boolean;
  };

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  rounded,
  active,
  ref,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size, active, rounded, className }))}
      {...props}
    />
  );
};

export default Button;
