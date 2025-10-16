'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import { MonitorSmartphone, Moon, Sun } from 'lucide-react';
import { isClient } from '@/app/utils';

type ThemeMode = 'system' | 'light' | 'dark';
const defaultMode: ThemeMode = 'system';

export const ThemeToggle: FC = () => {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(false);

  // Initialize from localStorage and system preference
  useEffect(() => {
    const stored = isClient() ? (localStorage.getItem('theme') as ThemeMode | null) : null;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    setSystemPrefersDark(mql.matches);
    setMode(stored || defaultMode);

    const handleChange = (ev: MediaQueryListEvent) => {
      setSystemPrefersDark(ev.matches);
    };
    mql.addEventListener('change', handleChange);
    return () => {
      mql.removeEventListener('change', handleChange);
    };
  }, []);

  // Apply theme to document and persist when manual
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'system') {
      root.removeAttribute('data-theme');
      // Do not persist system
      localStorage.removeItem('theme');
      return;
    }
    root.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
  }, [mode]);

  const effectiveDark = useMemo(() => {
    if (mode === 'system') {
      return systemPrefersDark;
    }
    return mode === 'dark';
  }, [mode, systemPrefersDark]);

  const cycleMode = () => {
    setMode(prev => {
      if (prev === 'system') {
        return 'dark';
      }
      if (prev === 'dark') {
        return 'light';
      }
      return 'system';
    });
  };

  const Icon = mode === 'system' ? MonitorSmartphone : effectiveDark ? Sun : Moon;
  const label = `Toggle theme (current: ${mode === 'system' ? 'system' : effectiveDark ? 'dark' : 'light'})`;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={cycleMode}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-foreground/20 hover:bg-foreground/5"
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};
