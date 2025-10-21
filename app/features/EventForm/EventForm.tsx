'use client';

import { FC, useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LANGUAGES, CATEGORIES, WEEKDAYS } from '@/app/constants';
import { ImageHero } from '@/app/features';
import { Event } from '@/app/types';
import { Button, RadioGroup, Radio } from '@/app/ui';
import { Input } from '@/app/ui';
import { Textarea } from '@/app/ui';
import { Checkbox, CheckboxGroup } from '@/app/ui';
import { TimeInput } from '@/app/ui';
import { cn } from '@/app/utils';
import PlaceAutocomplete, { PlacePayload } from '../PlaceAutocomplete/PlaceAutocomplete';

const schema = z
  .object({
    title: z.record(z.string(), z.string()),
    summary: z.record(z.string(), z.string()),
    categories: z.array(z.string()).max(3),
    scheduleMode: z.union([z.literal('single'), z.literal('range')]).default('single'),
    startDate: z.string().min(1),
    endDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    weekdays: z.array(z.string()).optional(),
    isDigital: z.coerce.boolean().default(false),
    website: z.string().url().optional(),
    ticketUrl: z.string().url().optional(),
    isFree: z.coerce.boolean().default(true),
    price: z.coerce.number().positive().optional(),
    image: z.any().optional(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().optional(),
  })
  .refine(val => LANGUAGES.every(l => (val.title?.[l.locale] ?? '').toString().trim().length > 0), {
    message: 'All languages: title is required',
    path: ['title'],
  })
  .refine(
    val => LANGUAGES.every(l => (val.summary?.[l.locale] ?? '').toString().trim().length > 0),
    {
      message: 'All languages: description is required',
      path: ['summary'],
    }
  )
  .refine(v => (v.scheduleMode === 'single' ? true : Boolean(v.endDate)), {
    message: 'End date is required for range',
    path: ['endDate'],
  });

type FormValues = z.infer<typeof schema>;

export const EventForm: FC = () => {
  const locale = useLocale();
  const t = useTranslations();
  const [place, setPlace] = useState<PlacePayload | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      title: Object.fromEntries(LANGUAGES.map(l => [l.locale, ''])),
      summary: Object.fromEntries(LANGUAGES.map(l => [l.locale, ''])),
      scheduleMode: 'single',
      categories: [],
      isDigital: false,
      isFree: true,
      startTime: '',
      endTime: '',
      weekdays: [],
      contactEmail: '',
      contactPhone: '',
    },
  });

  const scheduleMode = watch('scheduleMode');
  const isDigital = watch('isDigital');
  const isFree = watch('isFree');

  const toHHmm = (v: unknown): string => {
    if (!v) {
      return '';
    }
    if (typeof v === 'string') {
      // Accept raw HH:mm or longer strings and normalize to HH:mm
      return v.slice(0, 5);
    }
    const anyVal = v as { hour?: number; minute?: number };
    const h = anyVal?.hour ?? null;
    const m = anyVal?.minute ?? null;
    if (h == null || m == null) {
      return '';
    }
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  };

  useEffect(() => {
    // Ensure RHF tracks these controlled values
    register('startTime');
    register('endTime');
    register('weekdays');
  }, [register]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      const titlePayload = LANGUAGES.map(l => ({ _key: l.locale, value: values.title[l.locale] }));
      const summaryPayload = LANGUAGES.map(l => ({
        _key: l.locale,
        value: values.summary[l.locale],
      }));

      // In range mode, ensure at least one weekday is selected
      if (values.scheduleMode === 'range' && (!values.weekdays || values.weekdays.length === 0)) {
        // TODO: warn "Please select at least one weekday"
        setSubmitting(false);
        return;
      }

      const schedule: Event['schedule'] = {
        mode: values.scheduleMode,
        startDate: values.startDate,
        endDate: values.scheduleMode === 'range' ? values.endDate : undefined,
        startTime: values.startTime || undefined,
        endTime: values.endTime || undefined,
        weekdays: values.scheduleMode === 'range' ? values.weekdays || [] : undefined,
      };

      fd.append('title', JSON.stringify(titlePayload));
      fd.append('summary', JSON.stringify(summaryPayload));
      fd.append('schedule', JSON.stringify(schedule));
      fd.append('categories', JSON.stringify(values.categories));
      fd.append('isDigital', String(values.isDigital));
      if (values.website) {
        fd.append('website', values.website);
      }
      if (values.ticketUrl) {
        fd.append('ticketUrl', values.ticketUrl);
      }
      fd.append('isFree', String(values.isFree));
      if (!values.isFree && values.price != null) {
        fd.append('price', String(values.price));
      }
      if (place?.location?.lat != null && place.location.lng != null) {
        fd.append(
          'placeCandidate',
          JSON.stringify({
            name: place.name,
            address: place.address,
            lat: place.location.lat,
            lng: place.location.lng,
          })
        );
      }

      const imageInput = document.getElementById('image-input') as HTMLInputElement | null;
      const file = imageInput?.files?.[0];
      if (file) {
        fd.append('image', file);
      }

      if (values.contactEmail) {
        fd.append('organizerEmail', values.contactEmail);
      }
      if (values.contactPhone) {
        fd.append('organizerPhone', values.contactPhone);
      }

      const res = await fetch('/api/events/create', { method: 'POST', body: fd });
      if (!res.ok) {
        throw new Error('Failed');
      }
      // TODO: toast "Event submitted"
    } catch (e) {
      console.error(e);
      // TODO: toast Failed to submit
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-6 pb-10" onSubmit={handleSubmit(onSubmit)}>
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">{t('events.create.image-section')}</h2>
        <Input
          id="image-input"
          type="file"
          accept="image/*"
          label={t('events.create.image-label')}
          onChange={e => {
            const file = e.currentTarget.files?.[0];
            if (!file) {
              return setPreview(null);
            }
            const url = URL.createObjectURL(file);
            setPreview(url);
          }}
        />
        <ImageHero imgUrl={preview} title={t('events.create.image-preview-title')} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">Overview</h2>
        {LANGUAGES.map(lang => (
          <div key={lang.locale} className="flex flex-col gap-3">
            <h3 className="text-lg font-medium">
              {t('events.create.description-in-language', { language: lang.name })}
            </h3>
            <Input
              label={t('events.create.name-label', { language: lang.name })}
              {...register(`title.${lang.locale}` as const)}
            />
            <Textarea
              label={t('events.create.description-label', { language: lang.name })}
              minRows={4}
              {...register(`summary.${lang.locale}` as const)}
            />
          </div>
        ))}

        <h3 className="text-lg font-medium">{t('events.create.category-section')}</h3>
        <CheckboxGroup
          value={watch('categories')}
          onValueChange={val => setValue('categories', val as string[])}
        >
          {CATEGORIES.map(cat => (
            <Checkbox key={cat.slug} value={cat.slug}>
              {t(cat.i18n)}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">{t('events.create.when-section')}</h2>
        <RadioGroup
          label={t('events.create.select-dates')}
          orientation="horizontal"
          value={scheduleMode}
          onValueChange={val => setValue('scheduleMode', val as 'single' | 'range')}
        >
          <Radio value="single">{t('events.create.single-day')}</Radio>
          <Radio value="range">{t('events.create.date-range')}</Radio>
        </RadioGroup>
        <div className={cn('grid gap-3', scheduleMode === 'range' && 'grid-cols-2')}>
          <Input label={t('events.create.start-date')} type="date" {...register('startDate')} />
          {scheduleMode === 'range' && (
            <Input label={t('events.create.end-date')} type="date" {...register('endDate')} />
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TimeInput
            label={t('events.create.start-time')}
            hourCycle={24}
            onChange={val => setValue('startTime', toHHmm(val))}
          />
          <TimeInput
            label={t('events.create.end-time')}
            hourCycle={24}
            onChange={val => setValue('endTime', toHHmm(val))}
          />
        </div>

        {scheduleMode === 'range' && (
          <div className="mt-2">
            <CheckboxGroup
              label={t('events.create.weekdays-label')}
              value={watch('weekdays')}
              onValueChange={val => setValue('weekdays', val as string[])}
            >
              {WEEKDAYS.map(d => (
                <Checkbox key={d.slug} value={d.slug}>
                  {t(`events.weekday.${d.slug}`)}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">{t('events.create.where-section')}</h2>
        <Checkbox isSelected={isDigital} onValueChange={v => setValue('isDigital', v)}>
          {t('events.create.digital-checkbox')}
        </Checkbox>
        {!isDigital ? (
          <>
            <PlaceAutocomplete
              locale={locale}
              placeholder={t('events.create.search-location-placeholder')}
              onSelect={setPlace}
            />
            <Input
              label={t('events.create.website-url')}
              placeholder="https://"
              {...register('website')}
            />
          </>
        ) : (
          <Input
            label={t('events.create.website-url')}
            placeholder="https://"
            {...register('website')}
          />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">{t('events.create.tickets-section')}</h2>
        <RadioGroup
          label={t('events.create.pricing-label')}
          orientation="horizontal"
          value={isFree ? 'free' : 'paid'}
          onValueChange={v => setValue('isFree', v === 'free')}
        >
          <Radio value="free">{t('events.free')}</Radio>
          <Radio value="paid">{t('events.create.paid')}</Radio>
        </RadioGroup>
        <Input
          label={t('events.create.ticket-url')}
          placeholder="https://"
          {...register('ticketUrl')}
        />
        {!isFree && (
          <Input
            label={t('events.create.min-price')}
            type="number"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">€</span>
              </div>
            }
            {...register('price')}
          />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">{t('events.create.contact-section')}</h2>
        <Input
          label={t('events.create.contact-email')}
          type="email"
          placeholder="name@example.com"
          {...register('contactEmail')}
        />
        <Input
          label={t('events.create.contact-phone')}
          type="tel"
          placeholder="+34 600 000 000"
          {...register('contactPhone')}
        />
      </section>

      <div>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          isDisabled={submitting}
          isLoading={submitting}
        >
          {t('events.create.submit')}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
