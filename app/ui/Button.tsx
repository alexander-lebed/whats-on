'use client';
import { ButtonHTMLAttributes, Ref } from 'react';

const baseClasses =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:[--tw-ring-color:var(--color-primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const sizes: Record<Size, string> = {
  default: 'h-10 px-5 text-sm font-semibold',
  lg: 'h-12 px-6 text-base font-semibold',
  sm: 'h-8 px-4 text-xs font-medium',
};

const hollowColors = [
  'rounded-full',
  'border',
  'border-white/10',
  'bg-white/5',
  'text-white',
  'hover:bg-transparent',
  'focus:bg-transparent',
  // Border color only to avoid perceived size change
  'hover:border-[color:var(--color-primary)]',
  'focus:border-[color:var(--color-primary)]',
  // Active state fills the button but keeps border width
  'active:bg-[color:var(--color-primary)]',
  'active:text-white',
  'active:border-[color:var(--color-primary)]',
].join(' ');

const hollowActiveColors = [
  'rounded-full',
  'bg-[color:var(--color-primary)]',
  'text-white',
  'ring-0',
  'border',
  'border-[color:var(--color-primary)]',
  'hover:bg-[color:var(--color-primary)]',
  'focus:bg-[color:var(--color-primary)]',
  'active:border-[color:var(--color-primary)]',
].join(' ');

const defaultColors = 'rounded-md bg-white text-gray-900 hover:bg-gray-100';

type Variant = 'default' | 'hollow';
type Size = 'default' | 'lg' | 'sm';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isActive?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

export const Button = ({
  className = '',
  variant = 'default',
  size = 'default',
  isActive = false,
  ref,
  ...props
}: ButtonProps) => {
  const variantClasses =
    variant === 'hollow' ? (isActive ? hollowActiveColors : hollowColors) : defaultColors;

  return (
    <button
      ref={ref}
      className={[baseClasses, sizes[size], variantClasses, className].join(' ')}
      {...props}
    />
  );
};

export default Button;
