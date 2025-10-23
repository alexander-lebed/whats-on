'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { isClient } from '@/app/utils';

type ThemeMode = 'light' | 'dark';

type UseDarkModeReturn = {
  theme: ThemeMode;
  toggle: () => void;
};

const THEME_COOKIE_KEY = 'events-theme';
const THEME_COOKIE_MAX_AGE = 31536000; // 1 year in seconds
const THEME_EVENT = 'events-theme-mode';

let cookieWasRefreshed = false;

const getCookie = (key: string): string | null => {
  if (!isClient()) {
    return null;
  }
  try {
    const entry = document.cookie.split('; ').find(row => row.startsWith(`${key}=`));
    return entry ? entry.split('=')[1] : null;
  } catch {
    return null;
  }
};

const setThemeCookie = (mode: ThemeMode): void => {
  if (!isClient()) {
    return;
  }
  const isHttps = window.location.protocol === 'https:';
  document.cookie = `${THEME_COOKIE_KEY}=${mode}; Max-Age=${THEME_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${isHttps ? '; Secure' : ''}`;
  cookieWasRefreshed = true;
};

const getInitialTheme = (): ThemeMode => {
  if (!isClient()) {
    return 'light';
  }
  const root = document.documentElement;
  if (root.classList.contains('dark')) {
    return 'dark';
  }
  if (root.classList.contains('light')) {
    return 'light';
  }
  const fromCookie = getCookie(THEME_COOKIE_KEY);
  return fromCookie === 'dark' ? 'dark' : 'light';
};

export const useDarkMode = (): UseDarkModeReturn => {
  const [activeTheme, setActiveTheme] = useState<ThemeMode>(getInitialTheme);

  // Refresh cookie on mount to extend its lifetime if present
  useEffect(() => {
    const current = getCookie(THEME_COOKIE_KEY);
    if (current && !cookieWasRefreshed) {
      setThemeCookie((current as ThemeMode) === 'dark' ? 'dark' : 'light');
    }
  }, []);

  const inactiveTheme: ThemeMode = activeTheme === 'dark' ? 'light' : 'dark';

  // Apply theme to <html> and persist in cookie
  useEffect(() => {
    if (!isClient()) {
      return;
    }
    const root = document.documentElement;
    const { classList } = root;
    classList.remove(inactiveTheme);
    classList.add(activeTheme);
    // Trigger reflow to flush CSS changes
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    (root as HTMLElement).offsetHeight;
    setThemeCookie(activeTheme);
  }, [activeTheme, inactiveTheme]);

  // Listen to global theme change events to keep multiple consumers in sync
  useEffect(() => {
    const handler: EventListener = e => {
      setActiveTheme((e as CustomEvent<ThemeMode>).detail);
    };
    window.addEventListener(THEME_EVENT, handler);
    return () => window.removeEventListener(THEME_EVENT, handler);
  }, []);

  const toggle = useCallback(() => {
    const next: ThemeMode = inactiveTheme;
    if (isClient()) {
      window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_EVENT, { detail: next }));
    } else {
      setActiveTheme(next);
    }
  }, [inactiveTheme]);

  return useMemo(
    () => ({
      theme: activeTheme,
      toggle,
    }),
    [activeTheme, toggle]
  );
};
