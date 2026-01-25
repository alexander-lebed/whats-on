import { useCallback, useTransition } from 'react';
import confetti from 'canvas-confetti';
import { LANGUAGES } from '@/app/constants';
import { PlacePayload } from '@/app/features/PlaceAutocomplete';
import { Event } from '@/app/types';
import { useRouter } from '@/i18n/navigation';
import { FormValues } from '../types';

export const useFormSubmit = (): ((values: FormValues, place: PlacePayload | null) => void) => {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return useCallback(
    async (values: FormValues, place: PlacePayload | null) => {
      try {
        const fd = new FormData();
        const titlePayload = LANGUAGES.map(l => ({
          _key: l.locale,
          value: values.title[l.locale],
        }));
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
    },
    [router]
  );
};
