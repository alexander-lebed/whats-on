'use client';

import { FC } from 'react';
import {
  RadioGroup as HRadioGroup,
  type RadioGroupProps as HRadioGroupProps,
  Radio as HRadio,
  type RadioProps as HRadioProps,
} from '@heroui/radio';

export type RadioGroupProps = HRadioGroupProps;
export type RadioProps = HRadioProps;

export const Radio: FC<RadioProps> = props => {
  return <HRadio {...props} />;
};

export const SIZES: RadioGroupProps['size'][] = ['sm', 'md', 'lg'];
export const COLORS: RadioGroupProps['color'][] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];

const RadioGroup: FC<RadioGroupProps> = props => {
  return <HRadioGroup {...props} />;
};

export default RadioGroup;
