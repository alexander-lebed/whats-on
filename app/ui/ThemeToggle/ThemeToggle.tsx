'use client';

import { FC } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/app/hooks';
import { Button } from '@/app/ui';

export const ThemeToggle: FC = () => {
  const { theme, toggle } = useDarkMode();

  const Icon = theme === 'dark' ? Sun : Moon;
  const label = `Toggle theme (current: ${theme})`;

  return (
    <Button variant="light" size="sm" isIconOnly title={label} aria-label={label} onPress={toggle}>
      <Icon className="h-4 w-4" />
    </Button>
  );
};
