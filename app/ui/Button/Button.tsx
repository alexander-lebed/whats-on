'use client';

import { FC } from 'react';
import { Button as HButton, type ButtonProps as HButtonProps } from '@heroui/button';

export type ButtonProps = HButtonProps;

export const VARIANTS: ButtonProps['variant'][] = [
  'solid',
  'bordered',
  'flat',
  'ghost',
  'light',
  'faded',
  'shadow',
];
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
