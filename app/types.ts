import { ReactNode } from 'react';

export type Category = {
  slug: string;
  title: string /* displayed in Sanity */;
  i18n: string;
  iconComponent: ReactNode;
  emoji: string /* displayed in Sanity */;
};

export type Locale = 'en' | 'es';

export type Language = {
  name: string;
  locale: Locale;
};
