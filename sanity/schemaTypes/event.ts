import { defineField, defineType } from 'sanity';
import { CATEGORIES } from '@/app/constants';
import { SANITY_LANGUAGES } from '@/sanity/constants';
import ScheduleInput from './components/ScheduleInput';

type ScheduleParent = {
  mode?: 'single' | 'range';
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
};

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
          title: `${cat.emoji} ${cat.title}`.trim(),
          value: cat.slug,
        })),
      },
      validation: Rule => Rule.unique().max(3),
    }),
    // Schedule: supports single-day and date-range with consistent field names
    defineField({
      name: 'schedule',
      title: 'Schedule',
      type: 'object',
      components: { input: ScheduleInput },
      fields: [
        defineField({
          name: 'mode',
          title: 'Mode',
          type: 'string',
          options: {
            list: [
              { title: 'Single day', value: 'single' },
              { title: 'Date range (recurring)', value: 'range' },
            ],
            layout: 'radio',
          },
          initialValue: 'single',
          validation: Rule => Rule.required(),
        }),
        // Common, consistent names
        defineField({
          name: 'startDate',
          title: 'Start date',
          type: 'date',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'endDate',
          title: 'End date',
          type: 'date',
          hidden: ({ parent }) => (parent as ScheduleParent)?.mode === 'single',
          validation: Rule =>
            Rule.custom((val, ctx) => {
              if ((ctx.parent as ScheduleParent)?.mode !== 'range') return true;
              if (!val) return 'Required';
              const start = (ctx.parent as { startDate?: string }).startDate;
              return !start || val >= start || 'End date must be on/after start date';
            }),
        }),
        defineField({
          name: 'startTime',
          title: 'Start time',
          type: 'timeValue',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'endTime',
          title: 'End time',
          type: 'timeValue',
          validation: Rule =>
            Rule.custom((val, ctx) => {
              const start = (ctx.parent as { startTime?: string }).startTime;
              const mode = (ctx.parent as ScheduleParent)?.mode ?? 'single';
              if (!val) return 'Required';
              if (!start) return true;
              // In range mode enforce same-day end after start; in single allow overnight
              return mode === 'range' ? val > start || 'End must be after start' : true;
            }),
        }),
        defineField({
          name: 'weekdays',
          title: 'Weekdays',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'Mon', value: 'mon' },
              { title: 'Tue', value: 'tue' },
              { title: 'Wed', value: 'wed' },
              { title: 'Thu', value: 'thu' },
              { title: 'Fri', value: 'fri' },
              { title: 'Sat', value: 'sat' },
              { title: 'Sun', value: 'sun' },
            ],
            layout: 'grid',
          },
          hidden: ({ parent }) => (parent as ScheduleParent)?.mode !== 'range',
          validation: Rule =>
            Rule.custom((val, ctx) =>
              (ctx.parent as ScheduleParent)?.mode === 'range'
                ? (val?.length ?? 0) > 0 || 'Pick at least one day'
                : true
            ),
        }),
      ],
    }),
    defineField({
      name: 'isDigital',
      title: 'Digital / Online event',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'organizer',
      title: 'Organizer',
      type: 'reference',
      to: [{ type: 'organizer' }],
    }),
    defineField({
      name: 'place',
      title: 'Place',
      type: 'reference',
      to: [{ type: 'place' }, { type: 'organizer' }],
      description: 'Select a place or reuse the organizer when it is the place',
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
      by: [{ field: 'schedule.startDate', direction: 'asc' }],
    },
    {
      name: 'startDesc',
      title: 'Start date (desc)',
      by: [{ field: 'schedule.startDate', direction: 'desc' }],
    },
    {
      name: 'featuredFirst',
      title: 'Featured first',
      by: [
        { field: 'isFeatured', direction: 'desc' },
        { field: 'schedule.startDate', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      startSingle: 'schedule.startDate',
      startRange: 'schedule.startDate',
      endRange: 'schedule.endDate',
      sTime: 'schedule.startTime',
      eTime: 'schedule.endTime',
      placeTitle: 'place.title',
      media: 'image',
    },
    prepare({ title, startSingle, startRange, endRange, sTime, eTime, placeTitle, media }) {
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
      const subtitleParts: string[] = [];
      if (startSingle)
        subtitleParts.push(`${startSingle} ${sTime ?? ''}${eTime ? `–${eTime}` : ''}`.trim());
      else if (startRange || endRange)
        subtitleParts.push(
          `${startRange ?? '—'} → ${endRange ?? '—'} ${sTime ?? ''}${eTime ? `–${eTime}` : ''}`.trim()
        );
      if (placeTitle) subtitleParts.push(placeTitle);
      return {
        title: displayTitle,
        subtitle: subtitleParts.filter(Boolean).join(' • '),
        media,
      };
    },
  },
});
