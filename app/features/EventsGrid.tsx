import type { FC } from 'react';
import { useTranslations } from 'next-intl';
import EventCard, { EventCardProps } from './EventCard';

export type EventsGridProps = {
  items: Array<EventCardProps['item']>;
};

export const EventsGrid: FC<EventsGridProps> = ({ items }) => {
  const t = useTranslations();
  return (
    <section aria-labelledby="events-heading">
      <h2 id="events-heading" className="sr-only">
        {t('events.heading')}
      </h2>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(item => (
          <EventCard key={item._id} item={item} />
        ))}
      </ul>
    </section>
  );
};

export default EventsGrid;
