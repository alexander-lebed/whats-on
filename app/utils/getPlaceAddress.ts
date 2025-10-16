import { Event } from '@/app/types';

export const getPlaceAddress = (place: Event['place'], full = true) => {
  if (!place) {
    return '';
  }
  if (!full) {
    return place.address;
  }
  return [place.address, place.zipCode, place.city].filter(Boolean).join(', ');
};
