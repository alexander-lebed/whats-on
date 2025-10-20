'use client';

import { FC } from 'react';
import { Button as HButton, type ButtonProps as HButtonProps } from '@heroui/button';

export type ButtonProps = HButtonProps;
type ButtonVariant = NonNullable<ButtonProps['variant']>;

// Keep in sync with library variants; compiler checks via `satisfies`
export const VARIANTS = [
  'solid',
  'bordered',
  'flat',
  'ghost',
  'light',
  'faded',
  'shadow',
] as const satisfies readonly ButtonVariant[];
export const SIZES: ButtonProps['size'][] = ['sm', 'md', 'lg'];
export const COLORS: ButtonProps['color'][] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];

const Button: FC<ButtonProps> = props => {
  return <HButton {...props} />;
};

export default Button;
