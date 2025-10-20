'use client';

import { FC, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/app/ui';
import { isClient } from '@/app/utils';

type ThemeMode = 'light' | 'dark';
const defaultMode: ThemeMode = 'light';

export const ThemeToggle: FC = () => {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  // Initialize from localStorage
  useEffect(() => {
    const stored = isClient() ? (localStorage.getItem('theme') as ThemeMode | null) : null;
    setMode(stored || defaultMode);
  }, []);

  // Apply theme to document and persist
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('class', mode);
    localStorage.setItem('theme', mode);
  }, [mode]);

  const cycleMode = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const Icon = mode === 'dark' ? Sun : Moon;
  const label = `Toggle theme (current: ${mode})`;

  return (
    <Button
      variant="light"
      size="sm"
      isIconOnly
      title={label}
      aria-label={label}
      onPress={cycleMode}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};
