import { z } from 'zod';
import { LANGUAGES } from '@/app/constants';

export const formSchema = z
  .object({
    title: z.record(z.string(), z.string()),
    summary: z.record(z.string(), z.string()),
    categories: z
      .array(z.string())
      .min(1, { message: 'events.validation.categories-required' })
      .max(3, { message: 'events.validation.max-3-categories' }),
    scheduleMode: z.union([z.literal('single'), z.literal('range')]).default('single'),
    startDate: z.string().min(1, { message: 'events.validation.required' }),
    endDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    weekdays: z.array(z.string()).optional(),
    isDigital: z.coerce.boolean().default(false),
    website: z.url({ message: 'events.validation.invalid-url' }).or(z.literal('')).optional(),
    ticketUrl: z.url({ message: 'events.validation.invalid-url' }).or(z.literal('')).optional(),
    isFree: z.coerce.boolean().default(true),
    price: z
      .union([
        z.literal(''),
        z.coerce
          .number()
          .refine(v => !Number.isNaN(v), { message: 'events.validation.invalid-number' })
          .min(0, { message: 'events.validation.non-negative-number' }),
      ])
      .optional(),
    image: z.any().optional(),
    contactEmail: z.email({ message: 'events.validation.invalid-email' }).optional(),
    contactPhone: z.string().optional(),
    placeSelected: z.coerce.boolean().default(false),
  })
  .superRefine((val, ctx) => {
    // Per-language required for title and summary
    LANGUAGES.forEach(l => {
      const titleVal = (val.title?.[l.locale] ?? '').toString().trim();
      if (!titleVal) {
        ctx.addIssue({
          code: 'custom',
          path: ['title', l.locale],
          message: 'events.validation.required',
        });
      }
      const summaryVal = (val.summary?.[l.locale] ?? '').toString().trim();
      if (!summaryVal) {
        ctx.addIssue({
          code: 'custom',
          path: ['summary', l.locale],
          message: 'events.validation.required',
        });
      }
    });

    // Range-specific validations
    if (val.scheduleMode === 'range') {
      if (!val.endDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['endDate'],
          message: 'events.validation.end-date-required',
        });
      }
      if (val.startDate && val.endDate && val.endDate < val.startDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['endDate'],
          message: 'events.validation.end-date-after-start',
        });
      }
      if (!val.weekdays || val.weekdays.length === 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['weekdays'],
          message: 'events.validation.weekdays-required',
        });
      }
    }

    // Time ordering (range only)
    if (
      val.scheduleMode === 'range' &&
      val.startTime &&
      val.endTime &&
      val.endTime <= val.startTime
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['endTime'],
        message: 'events.validation.end-time-after-start-time',
      });
    }

    // Location required when not digital
    if (!val.isDigital && !val.placeSelected) {
      ctx.addIssue({
        code: 'custom',
        path: ['placeSelected'],
        message: 'events.validation.location-required',
      });
    }

    // Image required
    const imageList = val.image as FileList | undefined;
    if (!imageList || imageList.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['image'],
        message: 'events.validation.image-required',
      });
    }
  });
