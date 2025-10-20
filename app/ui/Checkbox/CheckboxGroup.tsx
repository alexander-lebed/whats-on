'use client';

import { FC } from 'react';
import {
  CheckboxGroup as HCheckboxGroup,
  type CheckboxGroupProps as HCheckboxGroupProps,
} from '@heroui/checkbox';

export type CheckboxGroupProps = HCheckboxGroupProps;

const CheckboxGroup: FC<CheckboxGroupProps> = props => {
  return <HCheckboxGroup {...props} />;
};

export default CheckboxGroup;
