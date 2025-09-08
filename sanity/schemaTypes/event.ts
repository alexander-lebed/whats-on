import { defineField, defineType } from 'sanity';
import { CATEGORIES } from '@/app/constants';
import { SANITY_LANGUAGES } from '@/sanity/constants';

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: Rule =>
        Rule.custom<{ _key: string; value?: string }[]>(value => {
          if (!value || value.length === 0) return 'Title is required';
          const invalidItems = value.filter(
            item => !item?.value || String(item.value).trim().length === 0
          );
          if (invalidItems.length) {
            return invalidItems.map(item => ({
              message: 'Title is required',
              path: [{ _key: item._key }, 'value'],
            }));
          }
          return true;
        }),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: doc => {
          const arr = doc?.title;
          if (Array.isArray(arr)) {
            const byKey = (k: string) => arr.find(x => x?._key === k)?.value;
            return byKey('es') || byKey('en') || arr[0]?.value;
          }
          return doc?.title;
        },
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'internationalizedArrayText',
      description: 'Describe what this event is about. It will be shown in the event page.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      description: 'Select up to 3 categories.',
      of: [{ type: 'string' }],
      options: {
        list: CATEGORIES.map(cat => ({
          title: `${cat.icon} ${cat.title}`.trim(),
          value: cat.slug,
        })),
      },
      validation: Rule => Rule.unique().max(3),
    }),
    defineField({
      name: 'startDateTime',
      title: 'Start date & time',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'endDateTime',
      title: 'End date & time',
      type: 'datetime',
      validation: Rule =>
        Rule.custom((end, context) => {
          const start = (context.parent as { startDateTime?: string } | undefined)?.startDateTime;
          if (!end || !start) return true;
          try {
            const endMs = new Date(end as string).getTime();
            const startMs = new Date(start as string).getTime();
            if (Number.isNaN(endMs) || Number.isNaN(startMs)) return true;
            return endMs >= startMs || 'End must be after start';
          } catch {
            return true;
          }
        }),
    }),
    defineField({
      name: 'isDigital',
      title: 'Digital / Online event',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'place',
      title: 'Place',
      type: 'reference',
      to: [{ type: 'place' }, { type: 'organizer' }],
      description: 'Select a place or reuse the organizer when it is the place',
    }),
    defineField({
      name: 'organizer',
      title: 'Organizer',
      type: 'reference',
      to: [{ type: 'organizer' }],
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Ticket URL',
      type: 'url',
      validation: Rule =>
        Rule.uri({ scheme: ['http', 'https'] }).custom((val, context) => {
          const price = (context.parent as { price?: number } | undefined)?.price;
          if (price && price > 0 && !val) {
            return 'Ticket URL is required when price > 0';
          }
          return true;
        }),
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      validation: Rule => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'isFree',
      title: 'Free',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      name: 'startAsc',
      title: 'Start date (asc)',
      by: [{ field: 'startDateTime', direction: 'asc' }],
    },
    {
      name: 'startDesc',
      title: 'Start date (desc)',
      by: [{ field: 'startDateTime', direction: 'desc' }],
    },
    {
      name: 'featuredFirst',
      title: 'Featured first',
      by: [
        { field: 'isFeatured', direction: 'desc' },
        { field: 'startDateTime', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      start: 'startDateTime',
      end: 'endDateTime',
      placeTitle: 'place.title',
      media: 'image',
    },
    prepare({ title, start, end, placeTitle, media }) {
      const getI18nValue = (arr: Array<{ _key: string; value: string }> | string) => {
        if (Array.isArray(arr) && arr.length) {
          const byKey = (k: string) => arr.find(x => x?._key === k)?.value;
          const lang = SANITY_LANGUAGES.find(lang => byKey(lang.id));
          if (lang) {
            return byKey(lang.id);
          }
          return arr.at(0)?.value;
        }
        return arr as string;
      };
      const displayTitle = getI18nValue(title);
      const format = (dateStr?: string) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return null;
        return {
          full: date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }),
          time: date.toLocaleTimeString(undefined, { timeStyle: 'short' }),
        };
      };
      const startFmt = format(start);
      const endFmt = format(end);
      const subtitleParts: string[] = [];
      if (startFmt) {
        subtitleParts.push(endFmt ? `${startFmt.full} – ${endFmt.time}` : startFmt.full);
      }
      if (placeTitle) subtitleParts.push(placeTitle);
      return {
        title: displayTitle,
        subtitle: subtitleParts.filter(Boolean).join(' • '),
        media,
      };
    },
  },
});
