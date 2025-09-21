'use client';
import { FC, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CATEGORIES } from '@/app/constants';
import { Button } from '@/app/ui';
import type { EVENTS_QUERY_I18NResult } from '@/sanity/types';
import { EventsGrid } from './EventsGrid';

export type EventsExplorerProps = {
  events: EVENTS_QUERY_I18NResult;
};

export const EventsExplorer: FC<EventsExplorerProps> = ({ events }) => {
  const t = useTranslations();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (slug: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const filteredEvents = useMemo(() => {
    if (selected.size === 0) return events;
    return events.filter(item => {
      if (!item.categories || item.categories.length === 0) return false;
      const itemSet = new Set(item.categories);
      for (const s of selected) {
        if (itemSet.has(s)) return true;
      }
      return false;
    });
  }, [events, selected]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map(category => {
          const isActive = selected.has(category.slug);
          return (
            <Button
              key={category.slug}
              variant="filter"
              aria-label={t(category.i18n)}
              active={isActive}
              onClick={() => toggle(category.slug)}
            >
              <span aria-hidden> {category.iconComponent} </span>
              <span>{t(category.i18n)}</span>
            </Button>
          );
        })}
      </div>
      <EventsGrid events={filteredEvents} />
    </div>
  );
};

export default EventsExplorer;
