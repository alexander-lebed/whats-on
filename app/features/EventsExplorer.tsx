'use client';
import { FC, useMemo, useState } from 'react';
import { CATEGORIES } from '@/app/constants';
import { Button } from '@/app/ui';
import type { EVENTS_QUERY_I18NResult } from '@/sanity/types';
import { EventsGrid } from './EventsGrid';

export type EventsExplorerProps = {
  items: EVENTS_QUERY_I18NResult;
};

export const EventsExplorer: FC<EventsExplorerProps> = ({ items }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (slug: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const filtered = useMemo(() => {
    if (selected.size === 0) return items;
    return items.filter(item => {
      if (!item.categories || item.categories.length === 0) return false;
      const itemSet = new Set(item.categories);
      for (const s of selected) {
        if (itemSet.has(s)) return true;
      }
      return false;
    });
  }, [items, selected]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map(category => {
          const isActive = selected.has(category.slug);
          return (
            <Button
              key={category.slug}
              variant="filter"
              aria-label={category.title}
              active={isActive}
              onClick={() => toggle(category.slug)}
            >
              <span aria-hidden> {category.icon} </span>
              <span>{category.title}</span>
            </Button>
          );
        })}
      </div>
      <EventsGrid items={filtered} />
    </div>
  );
};

export default EventsExplorer;
