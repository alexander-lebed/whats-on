'use client';
import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES } from '@/app/constants';
import type { EVENTS_QUERY_I18NResult } from '@/sanity/types';
import { urlForImage } from '../utils/sanityImage';

// TODO: date-fns or Intl.DateTimeFormat
// Deterministic UTC formatting to avoid server/client locale or tz mismatches
const formatDateRange = (start?: string | null, end?: string | null): string => {
  if (!start) return '';
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : undefined;
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const formatUTC = (d: Date) => `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
  const ymd = (d: Date) =>
    `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
  const sameDay = endDate ? ymd(startDate) === ymd(endDate) : false;
  const startStr = formatUTC(startDate);
  if (!endDate) return startStr;
  const endStr = formatUTC(endDate);
  return sameDay ? startStr : `${startStr} – ${endStr}`;
};

export type EventCardProps = { item: EVENTS_QUERY_I18NResult[number] };

export const EventCard: FC<EventCardProps> = ({ item }) => {
  const { title } = item;
  const imgUrl = urlForImage(item.image);
  const dateRange = formatDateRange(item.startDateTime, item.endDateTime);

  return (
    <li className="group list-none">
      <Link
        href={`/event/${item.slug}`}
        className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20 rounded-2xl"
      >
        <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 bg-white transition-transform duration-200 group-hover:-translate-y-0.5">
          <div
            className="relative w-full overflow-hidden rounded-b-none rounded-t-2xl"
            style={{ aspectRatio: '4 / 3' }}
          >
            {imgUrl ? (
              <Image
                className="object-cover"
                alt={title}
                priority
                fill
                src={imgUrl}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="h-full w-full bg-gray-100" />
            )}
          </div>
          <div className="p-4">
            {item.categories && item.categories?.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {item.categories.slice(0, 3).map(slug => {
                  const cat = CATEGORIES.find(c => c.slug === slug);
                  const label = cat ? cat.title : slug; // TODO: i18n
                  return (
                    <span
                      key={slug}
                      className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
            <h3 className="mb-1 line-clamp-2 text-lg font-semibold leading-snug text-gray-900">
              {title}
            </h3>
            <p className="text-sm text-gray-600">
              {dateRange}
              {item.place?.title ? (
                <>
                  <span className="mx-1">·</span>
                  {item.place?.title}
                </>
              ) : null}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default EventCard;
