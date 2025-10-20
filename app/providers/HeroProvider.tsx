'use client';

import { ReactNode } from 'react';
import { HeroUIProvider } from '@heroui/system';

export function HeroProvider({ children }: { children: ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}

export default HeroProvider;
