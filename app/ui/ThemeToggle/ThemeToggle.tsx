'use client';

import { FC, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDarkMode } from '@/app/hooks';
import { Button } from '@/app/ui';

export const ThemeToggle: FC = () => {
  const t = useTranslations();
  const { theme, toggle } = useDarkMode();

  // Render stable, theme-agnostic markup on SSR/first client render
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const Icon = mounted ? (theme === 'dark' ? Sun : Moon) : Sun;
  const label = mounted
    ? t('common.theme.toggle-label', { mode: theme === 'dark' ? 'light' : 'dark' })
    : undefined;

  return (
    <Button variant="light" size="sm" isIconOnly title={label} aria-label={label} onPress={toggle}>
      <Icon className="h-4 w-4" />
    </Button>
  );
};
