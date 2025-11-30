import {
  Music,
  Palette,
  Utensils,
  Users,
  Landmark,
  Drama,
  Volleyball,
  FerrisWheel,
  Lightbulb,
  Handshake,
  Martini,
} from 'lucide-react';
import { Category, Language } from '@/app/types';

export const THEME_COOKIE_KEY = 'events-theme';

export const CATEGORIES: Category[] = [
  {
    slug: 'music',
    title: 'Music',
    i18n: 'events.category.music',
    iconComponent: <Music />,
    iconName: 'music',
    emoji: '🎵',
  },
  {
    slug: 'clubs-parties',
    title: 'Clubs & Parties',
    i18n: 'events.category.clubs-parties',
    iconComponent: <Martini />,
    iconName: 'martini',
    emoji: '🍸',
  },
  {
    slug: 'stage-film',
    title: 'Stage & Film',
    i18n: 'events.category.stage-film',
    iconComponent: <Drama />,
    iconName: 'drama',
    emoji: '🎭',
  },
  {
    slug: 'art-exhibitions',
    title: 'Art & Exhibitions',
    i18n: 'events.category.art-exhibitions',
    iconComponent: <Palette />,
    iconName: 'palette',
    emoji: '🖼️',
  },
  {
    slug: 'eat-drink',
    title: 'Eat & Drink',
    i18n: 'events.category.eat-drink',
    iconComponent: <Utensils />,
    iconName: 'utensils',
    emoji: '🍴',
  },
  {
    slug: 'family-kids',
    title: 'Family & Kids',
    i18n: 'events.category.family',
    iconComponent: <Users />,
    iconName: 'users',
    emoji: '👪',
  },
  {
    slug: 'sports-wellness',
    title: 'Sports & Wellness',
    i18n: 'events.category.sports-wellness',
    iconComponent: <Volleyball />,
    iconName: 'volleyball',
    emoji: '🏐',
  },
  {
    slug: 'festivals-fairs',
    title: 'Festivals & Fairs',
    i18n: 'events.category.festivals-fairs',
    iconComponent: <FerrisWheel />,
    iconName: 'ferris-wheel',
    emoji: '🎡',
  },
  {
    slug: 'science-tech',
    title: 'Science & Tech',
    i18n: 'events.category.science-tech',
    iconComponent: <Lightbulb />,
    iconName: 'lightbulb',
    emoji: '💡',
  },
  {
    slug: 'networking-community',
    title: 'Networking & Community',
    i18n: 'events.category.networking-community',
    iconComponent: <Handshake />,
    iconName: 'handshake',
    emoji: '🤝',
  },
  {
    slug: 'local-fiestas',
    title: 'Local Fiestas',
    i18n: 'events.category.local-fiestas',
    iconComponent: <Landmark />,
    iconName: 'landmark',
    emoji: '🏛️',
  },
];

export const LANGUAGES: Language[] = [
  { name: 'Español', locale: 'es' },
  { name: 'English', locale: 'en' },
];

// TODO: Add i18n keys
export const WEEKDAYS: { slug: string; title: string }[] = [
  { slug: 'monday', title: 'Monday' },
  { slug: 'tuesday', title: 'Tuesday' },
  { slug: 'wednesday', title: 'Wednesday' },
  { slug: 'thursday', title: 'Thursday' },
  { slug: 'friday', title: 'Friday' },
  { slug: 'saturday', title: 'Saturday' },
  { slug: 'sunday', title: 'Sunday' },
];
