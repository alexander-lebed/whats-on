'use client';

import { FC } from 'react';
import { Checkbox as HCheckbox, type CheckboxProps as HCheckboxProps } from '@heroui/checkbox';

export type CheckboxProps = HCheckboxProps;

export const SIZES: CheckboxProps['size'][] = ['sm', 'md', 'lg'];
export const COLORS: CheckboxProps['color'][] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];

const Checkbox: FC<CheckboxProps> = props => {
  return <HCheckbox {...props} />;
};

export default Checkbox;
