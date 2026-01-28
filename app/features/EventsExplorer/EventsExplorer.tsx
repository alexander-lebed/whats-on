'use client';

import { FC, useCallback } from 'react';
import { type DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';
import { useTranslations } from 'next-intl';
import { CATEGORIES } from '@/app/constants';
import CategoryButton from '@/app/features/EventsExplorer/CategoryButton';
import NoEventsMessage from '@/app/features/EventsExplorer/NoEventsMessage';
import { Category, Event } from '@/app/types';
import EventsDateRangePicker from './EventsDateRangePicker';
import EventsGrid from './EventsGrid';
import { useFilteredEvents, useFiltersUrlSync } from './hooks';

type EventsExplorerProps = {
  events: Event[];
};

const EventsExplorer: FC<EventsExplorerProps> = ({ events }) => {
  const t = useTranslations();
  const [filters, setFilters] = useFiltersUrlSync();

  const filteredEvents = useFilteredEvents({ events, filters });

  const handleDateRange = useCallback(
    (value: RangeValue<DateValue> | null) =>
      setFilters(prev => ({
        ...prev,
        dateRange: value,
      })),
    [setFilters]
  );

  const toggleCategory = useCallback(
    ({ slug }: Category) => {
      setFilters(prev => {
        const updatedCategories = new Set(prev.categories);
        if (updatedCategories.has(slug)) {
          updatedCategories.delete(slug);
        } else {
          updatedCategories.add(slug);
        }
        return {
          ...prev,
          categories: updatedCategories,
        };
      });
    },
    [setFilters]
  );

  const { categories, dateRange } = filters;

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('events.title')}</h1>
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[240px]">
          <EventsDateRangePicker value={dateRange} onChange={handleDateRange} />
        </div>
      </div>
      <div className="relative -mx-4 sm:mx-0">
        <div className="flex flex-nowrap gap-3 overflow-x-auto px-4 pb-2 sm:flex-wrap sm:px-0 sm:pb-0 scrollbar-hide">
          {CATEGORIES.map(category => (
            <CategoryButton
              key={category.slug}
              isActive={categories.has(category.slug)}
              category={category}
              onClick={toggleCategory}
            />
          ))}
        </div>
        {/* Left gradient fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-background to-transparent sm:hidden" />
        {/* Right gradient fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent sm:hidden" />
      </div>

      {filteredEvents.length > 0 ? (
        <EventsGrid events={filteredEvents} />
      ) : (
        <NoEventsMessage hasActiveFilters={categories.size > 0 || dateRange !== null} />
      )}
    </div>
  );
};

export default EventsExplorer;
