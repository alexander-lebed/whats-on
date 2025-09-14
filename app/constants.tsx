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

export const CATEGORIES: Category[] = [
  {
    slug: 'music',
    title: 'Music',
    i18n: 'events.category.music',
    iconComponent: <Music />,
    emoji: '🎵',
  },
  {
    slug: 'clubs-parties',
    title: 'Clubs & Parties',
    i18n: 'events.category.clubs-parties',
    iconComponent: <Martini />,
    emoji: '🍸',
  },
  {
    slug: 'stage-film',
    title: 'Stage & Film',
    i18n: 'events.category.stage-film',
    iconComponent: <Drama />,
    emoji: '🎭',
  },
  {
    slug: 'art-exhibitions',
    title: 'Art & Exhibitions',
    i18n: 'events.category.art-exhibitions',
    iconComponent: <Palette />,
    emoji: '🖼️',
  },
  {
    slug: 'eat-drink',
    title: 'Eat & Drink',
    i18n: 'events.category.eat-drink',
    iconComponent: <Utensils />,
    emoji: '🍴',
  },
  {
    slug: 'family-kids',
    title: 'Family & Kids',
    i18n: 'events.category.family',
    iconComponent: <Users />,
    emoji: '👪',
  },
  {
    slug: 'sports-wellness',
    title: 'Sports & Wellness',
    i18n: 'events.category.sports-wellness',
    iconComponent: <Volleyball />,
    emoji: '🏐',
  },
  {
    slug: 'festivals-fairs',
    title: 'Festivals & Fairs',
    i18n: 'events.category.festivals-fairs',
    iconComponent: <FerrisWheel />,
    emoji: '🎡',
  },
  {
    slug: 'science-tech',
    title: 'Science & Tech',
    i18n: 'events.category.science-tech',
    iconComponent: <Lightbulb />,
    emoji: '💡',
  },
  {
    slug: 'networking-community',
    title: 'Networking & Community',
    i18n: 'events.category.networking-community',
    iconComponent: <Handshake />,
    emoji: '🤝',
  },
  {
    slug: 'local-fiestas',
    title: 'Local Fiestas',
    i18n: 'events.category.local-fiestas',
    iconComponent: <Landmark />,
    emoji: '🏛️',
  },
];

export const LANGUAGES: Language[] = [
  { name: 'Español', locale: 'es' },
  { name: 'English', locale: 'en' },
];
