import { ReactNode } from 'react';
import type { IconName } from 'lucide-react/dynamic';
import { EVENTS_QUERY_I18NResult } from '@/sanity/types';

export type Category = {
  slug: string;
  title: string /* displayed in Sanity */;
  i18n: string;
  iconComponent: ReactNode;
  emoji: string /* displayed in Sanity */;
  iconName: IconName;
};

export type Locale = 'en' | 'es';

export type Language = {
  name: string;
  locale: Locale;
};

export type Event = EVENTS_QUERY_I18NResult[number];
