export type Category = {
  slug: string;
  title: string /* Used to display in Sanity */;
  i18n: string;
  icon: string;
};

export type Locale = 'en' | 'es';

export type Language = {
  name: string;
  locale: Locale;
};
