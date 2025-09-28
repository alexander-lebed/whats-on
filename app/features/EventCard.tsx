'use client';
import { FC } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CATEGORIES } from '@/app/constants';
import { formatDateRange } from '@/app/utils';
import { Link } from '@/i18n/navigation';
import type { EVENTS_QUERY_I18NResult } from '@/sanity/types';
import { urlForImage } from '../utils/sanityImage';

export type EventCardProps = { event: EVENTS_QUERY_I18NResult[number] };

export const EventCard: FC<EventCardProps> = ({ event }) => {
  const t = useTranslations();
  const { title } = event;
  const imgUrl = urlForImage(event.image);
  const dateRange = event.schedule
    ? formatDateRange(event.schedule.startDate, event.schedule.endDate)
    : '';

  return (
    <li className="group list-none">
      <Link
        href={`/events/${event.slug}`}
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
