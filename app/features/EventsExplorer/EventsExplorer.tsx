'use client';

import { FC, useCallback, useState } from 'react';
import { type DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';
import { useTranslations } from 'next-intl';
import { CATEGORIES } from '@/app/constants';
import CategoryButton from '@/app/features/EventsExplorer/CategoryButton';
import NoEventsMessage from '@/app/features/EventsExplorer/NoEventsMessage';
import { Category, Event } from '@/app/types';
import EventsDateRangePicker from './EventsDateRangePicker';
import EventsGrid from './EventsGrid';
import { useFilteredEvents } from './hooks';
import { EventFilters } from './types';

type EventsExplorerProps = {
  events: Event[];
};

const EventsExplorer: FC<EventsExplorerProps> = ({ events }) => {
  const t = useTranslations();
  const [filters, setFilters] = useState<EventFilters>({
    categories: new Set(),
    dateRange: null,
  });

  const filteredEvents = useFilteredEvents({ events, filters });

  const handleDateRange = useCallback(
    (value: RangeValue<DateValue> | null) =>
      setFilters(prev => ({
        ...prev,
        dateRange: value,
      })),
    []
  );

  const toggleCategory = useCallback(({ slug }: Category) => {
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
  }, []);

  const { categories, dateRange } = filters;

  return (
    <>
      <div className="mb-3 sm:mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('events.title')}</h1>
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[240px]">
          <EventsDateRangePicker value={dateRange} onChange={handleDateRange} />
        </div>
      </div>
      <div className="flex flex-col gap-6 sm:gap-10">
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map(category => (
            <CategoryButton
              key={category.slug}
              isActive={categories.has(category.slug)}
              category={category}
              onClick={toggleCategory}
            />
          ))}
        </div>
        {filteredEvents.length > 0 ? (
          <EventsGrid events={filteredEvents} />
        ) : (
          <NoEventsMessage hasActiveFilters={categories.size > 0 || dateRange !== null} />
        )}
      </div>
    </>
  );
};

export default EventsExplorer;
