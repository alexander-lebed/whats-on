import { ReactElement } from 'react';
import { LucideProps } from 'lucide-react';
import type { IconName } from 'lucide-react/dynamic';
import { EVENTS_QUERY_I18NResult } from '@/sanity/types';

export type Category = {
  slug: string;
  title: string /* displayed in Sanity */;
  i18n: string;
  iconComponent: ReactElement<LucideProps>;
  emoji: string /* displayed in Sanity */;
  iconName: IconName;
};

export type Locale = 'en' | 'es';

export type Language = {
  name: string;
  locale: Locale;
};

export type Event = EVENTS_QUERY_I18NResult[number];

/**
 * Form values for the event creation form.
 */
export type EventFormValues = {
  title: Record<string, string>;
  summary: Record<string, string>;
  scheduleMode: 'single' | 'range';
  categories: string[];
  isDigital: boolean;
  isFree: boolean;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  weekdays: string[];
  contactEmail: string;
  contactPhone: string;
  website?: string;
  ticketUrl?: string;
  price?: number;
  placeSelected: boolean;
  image?: unknown; // FileList
};
