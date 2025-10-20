'use client';

import { FC } from 'react';
import { Button as HButton, type ButtonProps as HButtonProps } from '@heroui/button';

export type ButtonProps = HButtonProps;

const Button: FC<ButtonProps> = props => {
  return <HButton {...props} />;
};

export default Button;
