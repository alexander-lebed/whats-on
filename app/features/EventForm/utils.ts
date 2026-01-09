import { PlacePayload } from '@/app/features/PlaceAutocomplete';
import { Event } from '@/app/types';
import { EventFormValues } from './types';

export const transformFormValuesToEvent = (
  values: EventFormValues,
  place: PlacePayload | null,
  previewImage: string | undefined,
  locale: 'en' | 'es'
): Event => {
  const schedule: Event['schedule'] = {
    mode: values.scheduleMode,
    startDate: values.startDate,
    endDate: values.scheduleMode === 'range' ? values.endDate : undefined,
    startTime: values.startTime || undefined,
    endTime: values.endTime || undefined,
    weekdays: values.scheduleMode === 'range' ? values.weekdays || [] : undefined,
  };

  const placeData =
    place && place.location?.lat && place.location.lng
      ? {
          _id: 'preview-place',
          name: place.name,
          address: place.address,
          city: place.city ?? null,
          slug: { _type: 'slug' as const, current: 'preview-place-slug' },
          zipCode: place.zipCode ?? null,
          location: {
            _type: 'geopoint' as const,
            lat: place.location.lat,
            lng: place.location.lng,
          },
        }
      : null;

  // Use the passed locale to select the correct translation
  const title = values.title[locale] ?? '';
  const summary = values.summary[locale] ?? '';

  // Convert price
  const price =
    values.price != null && values.price !== 0 && !Number.isNaN(Number(values.price))
      ? Number(values.price)
      : undefined;

  // Construct image: urlForImage handles string URLs (blob/http) directly
  // For preview, we pass the blob URL string which urlForImage will return as-is
  // Type assertion needed since Event.image expects object, but urlForImage handles strings
  const image = (previewImage || {
    _type: 'image',
    asset: {
      _ref: 'image-core',
      _type: 'reference',
    },
  }) as Event['image'];

  return {
    _id: 'preview-event',
    _type: 'event',
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: 'preview-rev',
    slug: 'preview-slug', // Event.slug is string, not object
    title,
    summary,
    image,
    categories: values.categories,
    schedule,
    isDigital: values.isDigital,
    place: placeData,
    ticketUrl: values.ticketUrl,
    website: values.website,
    price,
    isFree: values.isFree ?? true, // Ensure boolean
    isFeatured: false,
  };
};
