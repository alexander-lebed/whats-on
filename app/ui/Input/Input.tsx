'use client';

import { FC } from 'react';
import { Input as HInput, type InputProps as HInputProps } from '@heroui/input';

export type InputProps = HInputProps;

export const VARIANTS: InputProps['variant'][] = ['flat', 'bordered', 'faded', 'underlined'];
export const SIZES: InputProps['size'][] = ['sm', 'md', 'lg'];
export const COLORS: InputProps['color'][] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];

const Input: FC<InputProps> = props => {
  return <HInput {...props} />;
};

export default Input;
