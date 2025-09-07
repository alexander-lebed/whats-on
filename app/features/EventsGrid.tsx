import type { FC } from 'react';
import EventCard, { EventCardProps } from './EventCard';

export type EventsGridProps = {
  items: Array<EventCardProps['item']>;
};

export const EventsGrid: FC<EventsGridProps> = ({ items }) => {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(item => (
        <EventCard key={item._id} item={item} />
      ))}
    </ul>
  );
};

export default EventsGrid;
