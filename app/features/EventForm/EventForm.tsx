'use client';

import { FC, useState, useEffect, useMemo, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import confetti from 'canvas-confetti';
import { parseISO, eachDayOfInterval, getDay, format, startOfToday } from 'date-fns';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LANGUAGES, CATEGORIES, WEEKDAYS } from '@/app/constants';
import { ImageHero, PlaceAutocomplete, Map } from '@/app/features';
import { EventFormValues } from '@/app/features/EventForm/types';
import { PlacePayload } from '@/app/features/PlaceAutocomplete';
import { useBreakpoint } from '@/app/hooks';
import { Event } from '@/app/types';
import {
  Button,
  RadioGroup,
  Radio,
  Input,
  TimeInput,
  Textarea,
  Checkbox,
  CheckboxGroup,
} from '@/app/ui';
import { cn } from '@/app/utils';
import { useRouter } from '@/i18n/navigation';
import { formSchema } from './constants';
import { EventPreviewModal } from './EventPreviewModal';
import { transformFormValuesToEvent } from './utils';

type FormValues = z.input<typeof formSchema>;

const inputVariant = 'faded';

export const EventForm: FC = () => {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { isMobile } = useBreakpoint();
  const [place, setPlace] = useState<PlacePayload | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted, touchedFields, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
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
      placeSelected: false,
    },
  });

  const scheduleMode = (watch('scheduleMode') ?? 'single') as FormValues['scheduleMode'];
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const isDigital = !!watch('isDigital');
  const isFree = !!watch('isFree');
  const todayISO = useMemo(() => format(startOfToday(), 'yyyy-MM-dd'), []);

  const sortedLanguages = useMemo(
    () => [...LANGUAGES].sort((a, b) => (a.locale === 'es' ? -1 : b.locale === 'es' ? 1 : 0)),
    []
  );

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
    register('image');
    register('placeSelected');
  }, [register]);

  const onSubmit = async (values: FormValues) => {
    try {
      const fd = new FormData();
      const titlePayload = LANGUAGES.map(l => ({ _key: l.locale, value: values.title[l.locale] }));
      const summaryPayload = LANGUAGES.map(l => ({
        _key: l.locale,
        value: values.summary[l.locale],
      }));

      const schedule: Event['schedule'] = {
        mode: values.scheduleMode ?? 'single',
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

      const file = (values.image as FileList | undefined)?.[0];
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
      const data = (await res.json()) as { id: string; slug: string };
      router.push(`/events/${data.slug}`);
      startTransition(() => {
        const defaults = { spread: 60, startVelocity: 55, ticks: 70, zIndex: 9999 } as const;
        confetti({ ...defaults, particleCount: 80, angle: 60, origin: { x: 0, y: 1 } });
        confetti({ ...defaults, particleCount: 80, angle: 120, origin: { x: 1, y: 1 } });
      });
    } catch (e) {
      console.error(e);
      // TODO: toast Failed to submit
    }
  };

  const availableWeekdaySlugs = useMemo<string[]>(() => {
    if (scheduleMode !== 'range') {
      return [];
    }
    if (!startDate || !endDate) {
      return [];
    }
    if (endDate < startDate) {
      return [];
    }
    try {
      const s = parseISO(startDate);
      const e = parseISO(endDate);
      const unique = new Set<string>();
      const weekdayIndexToSlug = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      eachDayOfInterval({ start: s, end: e }).forEach(d => {
        const idx = getDay(d); // 0 = Sunday, 6 = Saturday
        const slug = weekdayIndexToSlug[idx];
        if (slug) {
          unique.add(slug);
        }
      });
      // Preserve display order defined in WEEKDAYS
      return WEEKDAYS.map(d => d.slug).filter(slug => unique.has(slug));
    } catch {
      return [];
    }
  }, [scheduleMode, startDate, endDate]);

  // Select all available weekdays when start/end date changes
  useEffect(() => {
    if (scheduleMode === 'range' && availableWeekdaySlugs.length > 0) {
      setValue('weekdays', availableWeekdaySlugs, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [scheduleMode, availableWeekdaySlugs, setValue]);

  const placeForMap = useMemo<Event['place'] | undefined>(() => {
    if (!place || !place.location?.lat || !place.location.lng) {
      return undefined;
    }
    return {
      ...place,
      _id: 'candidate',
      city: place.city ?? null,
      zipCode: place.zipCode ?? null,
      location: {
        _type: 'geopoint',
        lat: place.location.lat,
        lng: place.location.lng,
      },
    };
  }, [place]);

  return (
    <form className="flex flex-col gap-10 pb-20" onSubmit={handleSubmit(onSubmit)}>
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">{t('events.create.image-section')}</h2>
        {(() => {
          const imageField = register('image');
          return (
            <Input
              id="image-input"
              type="file"
              accept="image/*"
              label={t('events.create.image-label')}
              variant={inputVariant}
              isRequired
              isInvalid={!!errors.image}
              errorMessage={errors.image?.message ? t(errors.image.message as string) : undefined}
              name={imageField.name}
              onBlur={imageField.onBlur}
              ref={imageField.ref}
              onChange={e => {
                imageField.onChange(e);
                const file = (e.currentTarget as HTMLInputElement)?.files?.[0];
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
          );
        })()}
        <ImageHero imgUrl={preview} title={t('events.create.image-preview-title')} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">{t('events.create.overview-section')}</h2>
        {sortedLanguages.map(lang => (
          <div key={lang.locale} className="flex flex-col gap-3">
            <h3>{t('events.create.description-in-language', { language: lang.name })}</h3>
            <Input
              label={t('events.create.name-label', { language: lang.name })}
              variant={inputVariant}
              isRequired
              isInvalid={!!errors.title?.[lang.locale]}
              errorMessage={
                errors.title?.[lang.locale]?.message
                  ? t(errors.title?.[lang.locale]?.message as string)
                  : undefined
              }
              {...register(`title.${lang.locale}`)}
            />
            <Textarea
              label={t('events.create.description-label', { language: lang.name })}
              variant={inputVariant}
              isRequired
              minRows={4}
              isInvalid={!!errors.summary?.[lang.locale]}
              errorMessage={
                errors.summary?.[lang.locale]?.message
                  ? t(errors.summary?.[lang.locale]?.message as string)
                  : undefined
              }
              {...register(`summary.${lang.locale}`)}
            />
          </div>
        ))}

        <CheckboxGroup
          label={t('events.create.category-section')}
          isRequired
          value={watch('categories')}
          onValueChange={val =>
            setValue('categories', val, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            })
          }
          isInvalid={!!errors.categories}
          errorMessage={errors.categories?.message ? t(errors.categories?.message) : undefined}
        >
          {CATEGORIES.map(cat => (
            <Checkbox key={cat.slug} value={cat.slug}>
              <div className="flex items-center gap-2" aria-label={t(cat.i18n)}>
                <DynamicIcon name={cat.iconName} size="1em" />
                <span>{t(cat.i18n)}</span>
              </div>
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
          onValueChange={val =>
            setValue('scheduleMode', val as FormValues['scheduleMode'], {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            })
          }
        >
          <Radio value="single">{t('events.create.single-day')}</Radio>
          <Radio value="range">{t('events.create.date-range')}</Radio>
        </RadioGroup>
        <div className={cn('grid gap-3', scheduleMode === 'range' && 'grid-cols-2')}>
          <Input
            label={t('events.create.start-date')}
            variant={inputVariant}
            type="date"
            isRequired
            isInvalid={!!errors.startDate}
            errorMessage={errors.startDate?.message ? t(errors.startDate?.message) : undefined}
            min={todayISO}
            {...register('startDate')}
          />
          {scheduleMode === 'range' && (
            <Input
              label={t('events.create.end-date')}
              variant={inputVariant}
              type="date"
              isRequired
              isInvalid={!!errors.endDate}
              errorMessage={errors.endDate?.message ? t(errors.endDate?.message) : undefined}
              min={startDate || todayISO}
              {...register('endDate')}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TimeInput
            label={t('events.create.start-time')}
            variant={inputVariant}
            hourCycle={24}
            isInvalid={!!errors.startTime}
            errorMessage={errors.startTime?.message ? t(errors.startTime.message) : undefined}
            onChange={val =>
              setValue('startTime', toHHmm(val), {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
          />
          <TimeInput
            label={t('events.create.end-time')}
            variant={inputVariant}
            hourCycle={24}
            isInvalid={!!errors.endTime}
            errorMessage={errors.endTime?.message ? t(errors.endTime.message) : undefined}
            onChange={val =>
              setValue('endTime', toHHmm(val), {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
          />

          {scheduleMode === 'range' && startDate && endDate && (
            <CheckboxGroup
              label={t('events.create.weekdays-label')}
              isRequired
              value={watch('weekdays')}
              onValueChange={val => {
                const filtered = val.filter(w => availableWeekdaySlugs.includes(w));
                setValue('weekdays', filtered, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
              isInvalid={!!errors.weekdays}
              errorMessage={errors.weekdays?.message ? t(errors.weekdays.message) : undefined}
            >
              {availableWeekdaySlugs.map(slug => (
                <Checkbox key={slug} value={slug}>
                  {t(`events.weekday.${slug}`)}
                </Checkbox>
              ))}
            </CheckboxGroup>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">{t('events.create.where-section')}</h2>
        <Checkbox
          isSelected={isDigital}
          onValueChange={(v: boolean) =>
            setValue('isDigital', v, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            })
          }
        >
          {t('events.create.digital-checkbox')}
        </Checkbox>
        {!isDigital && (
          <>
            <PlaceAutocomplete
              label={t('events.create.location-label')}
              placeholder={t('events.create.search-location-placeholder')}
              variant={inputVariant}
              locale={locale}
              isRequired
              onSelect={p => {
                setPlace(p);
                setValue('placeSelected', !!p, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
              isInvalid={
                (isSubmitted || touchedFields.placeSelected) && !!errors.placeSelected?.message
              }
              errorMessage={
                isSubmitted || touchedFields.placeSelected
                  ? errors.placeSelected?.message
                    ? t(errors.placeSelected.message)
                    : undefined
                  : undefined
              }
              onClear={() => {
                setPlace(null);
                setValue('placeSelected', false, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
              onBlur={() => {
                setValue('placeSelected', !!place, {
                  shouldValidate: true,
                  shouldTouch: true,
                });
              }}
            />
            <Map
              className="rounded-xl overflow-hidden"
              places={placeForMap ? [placeForMap] : []}
              center={
                placeForMap?.location?.lat && placeForMap?.location?.lng
                  ? { lat: placeForMap.location.lat, lng: placeForMap.location.lng }
                  : undefined
              }
            />
          </>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">{t('events.create.tickets-section')}</h2>
        <RadioGroup
          label={t('events.create.pricing-label')}
          orientation="horizontal"
          value={isFree ? 'free' : 'paid'}
          onValueChange={v =>
            setValue('isFree', v === 'free', {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            })
          }
        >
          <Radio value="free">{t('events.free')}</Radio>
          <Radio value="paid">{t('events.create.paid')}</Radio>
        </RadioGroup>
        {!isFree && (
          <>
            <Input
              label={t('events.create.ticket-url')}
              placeholder="https://"
              variant={inputVariant}
              isInvalid={!!errors.ticketUrl}
              errorMessage={errors.ticketUrl?.message ? t(errors.ticketUrl.message) : undefined}
              {...register('ticketUrl')}
            />
            <Input
              type="number"
              label={t('events.min-price')}
              variant={inputVariant}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">€</span>
                </div>
              }
              {...register('price')}
            />
          </>
        )}
      </section>

      <section className={`flex flex-col gap-3 ${isMobile ? 'pb-10' : ''}`}>
        <h2 className="text-xl font-bold">{t('events.create.contact-section')}</h2>
        <Input
          label={t('events.create.website-url')}
          placeholder="https://"
          variant={inputVariant}
          isInvalid={!!errors.website}
          errorMessage={errors.website?.message ? t(errors.website.message) : undefined}
          {...register('website')}
        />
        <Input
          type="email"
          label={t('events.create.contact-email')}
          placeholder="name@example.com"
          variant={inputVariant}
          isRequired
          isInvalid={!!errors.contactEmail}
          errorMessage={errors.contactEmail?.message ? t(errors.contactEmail.message) : undefined}
          {...register('contactEmail')}
        />
        <Input
          type="tel"
          label={t('events.create.contact-phone')}
          placeholder="+34 600 000 000"
          variant={inputVariant}
          {...register('contactPhone')}
        />
      </section>

      {!isMobile && (
        <div className="flex items-center gap-3">
          <Button variant="bordered" isDisabled={!isValid} onPress={() => setIsPreviewOpen(true)}>
            {t('events.create.preview-button')}
          </Button>
          <Button
            type="submit"
            variant="solid"
            color="primary"
            isDisabled={isSubmitting || !isValid}
            isLoading={isSubmitting}
          >
            {t('events.create.submit')}
          </Button>
          {!isValid && (
            <p className="text-sm text-default-500">{t('events.create.required-fields-message')}</p>
          )}
        </div>
      )}

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-default-200 z-50 flex flex-col gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
          {!isValid && (
            <p className="text-sm text-default-500 text-center">
              {t('events.create.required-fields-message')}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button
              variant="bordered"
              isDisabled={!isValid}
              onPress={() => setIsPreviewOpen(true)}
              className="flex-1"
            >
              {t('events.create.preview-button')}
            </Button>
            <Button
              type="submit"
              variant="solid"
              color="primary"
              isDisabled={isSubmitting || !isValid}
              isLoading={isSubmitting}
              className="flex-1"
            >
              {t('events.create.submit')}
            </Button>
          </div>
        </div>
      )}

      <EventPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        event={transformFormValuesToEvent(
          watch() as EventFormValues,
          place,
          preview ?? undefined,
          locale as 'en' | 'es'
        )}
      />
    </form>
  );
};

export default EventForm;
