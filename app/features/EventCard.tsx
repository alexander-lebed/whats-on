'use client';
import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CATEGORIES } from '@/app/constants';
import type { EVENTS_QUERY_I18NResult } from '@/sanity/types';
import { urlForImage } from '../utils/sanityImage';

// Format `schedule` into a compact date label (e.g., "Apr 5 – Apr 7")
const formatDateRange = (start?: string | null, end?: string | null): string => {
  if (!start) return '';
  const [y, m, d] = start.split('-').map(Number);
  const startDate = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  const endDate = end
    ? new Date(
        Date.UTC(
          ...((end.split('-').map(Number) as [number, number, number]).map((v, i) =>
            i === 1 ? v - 1 : v
          ) as unknown as [number, number, number])
        )
      )
    : undefined;
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
  const formatUTC = (dt: Date) => `${months[dt.getUTCMonth()]} ${dt.getUTCDate()}`;
  const ymd = (dt: Date) =>
    `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
  const sameDay = endDate ? ymd(startDate) === ymd(endDate) : false;
  const startStr = formatUTC(startDate);
  if (!endDate) return startStr;
  const endStr = formatUTC(endDate);
  return sameDay ? startStr : `${startStr} – ${endStr}`;
};

export type EventCardProps = { event: EVENTS_QUERY_I18NResult[number] };

export const EventCard: FC<EventCardProps> = ({ event }) => {
  const t = useTranslations();
  const { title } = event;
  const imgUrl = urlForImage(event.image);
  const dateRange = formatDateRange(event.schedule?.startDate, event.schedule?.endDate);

  return (
    <li className="group list-none">
      <Link
        href={`/event/${event.slug}`}
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
            {event.categories && event.categories?.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {event.categories.slice(0, 3).map(slug => {
                  const cat = CATEGORIES.find(c => c.slug === slug);
                  const label = cat ? t(cat.i18n) : slug;
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
              {event.place?.title ? (
                <>
                  <span className="mx-1">·</span>
                  {event.place?.title}
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
