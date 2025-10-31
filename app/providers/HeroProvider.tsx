'use client';

import { ReactNode } from 'react';
import { HeroUIProvider } from '@heroui/system';

type HeroProviderProps = {
  children: ReactNode;
  locale?: string;
};

export function HeroProvider({ children, locale = 'en' }: HeroProviderProps) {
  return <HeroUIProvider locale={locale}>{children}</HeroUIProvider>;
}

export default HeroProvider;
