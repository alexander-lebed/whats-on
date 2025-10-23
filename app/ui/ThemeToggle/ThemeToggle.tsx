'use client';

import { FC } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDarkMode } from '@/app/hooks';
import { Button } from '@/app/ui';

export const ThemeToggle: FC = () => {
  const t = useTranslations();
  const { theme, toggle } = useDarkMode();

  const Icon = theme === 'dark' ? Sun : Moon;
  const label = t('common.theme.toggle-label', { mode: theme === 'dark' ? 'light' : 'dark' });

  return (
    <Button variant="light" size="sm" isIconOnly title={label} aria-label={label} onPress={toggle}>
      <Icon className="h-4 w-4" />
    </Button>
  );
};
