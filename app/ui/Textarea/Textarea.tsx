'use client';

import { FC } from 'react';
import { Textarea as HTextarea, type TextAreaProps as HTextareaProps } from '@heroui/input';

export type TextareaProps = HTextareaProps;

export const VARIANTS: TextareaProps['variant'][] = ['flat', 'bordered', 'faded', 'underlined'];
export const SIZES: TextareaProps['size'][] = ['sm', 'md', 'lg'];
export const COLORS: TextareaProps['color'][] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];

const Textarea: FC<TextareaProps> = props => {
  return <HTextarea {...props} />;
};

export default Textarea;
