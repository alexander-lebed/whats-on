import type { FC } from 'react';
import { useTranslations } from 'next-intl';
import { ImageHero, Map } from '@/app/features';
import { Event, Locale } from '@/app/types';
import { urlForImage } from '@/app/utils/sanityImage';
import EventDetailsActions from './EventDetailsActions';
import EventDetailsDates from './EventDetailsDates';
import EventDetailsHeader from './EventDetailsHeader';
import EventDetailsSidebar from './EventDetailsSidebar';

type Props = {
  event: Event;
  locale: Locale;
  preview?: boolean;
};

export const EventDetails: FC<Props> = ({ event, locale, preview }) => {
  const t = useTranslations();
  const imgUrl = urlForImage(event.image);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
      {/* Main Content */}
      <article className="flex flex-col gap-8 lg:col-span-8">
        <header className="flex flex-col gap-6">
          <EventDetailsHeader event={event} locale={locale} />
          <ImageHero imgUrl={imgUrl} title={event.title} />
        </header>

        {/* Description Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{t('events.about')}</h2>
          <p className="max-w-3xl leading-relaxed whitespace-pre-line text-stone-600 dark:text-stone-300 text-lg sm:text-base">
            {event.summary}
          </p>
        </section>

        {/* All dates */}
        <EventDetailsDates schedule={event.schedule} locale={locale} />

        {/* Sidebar for mobile */}
        <div className="lg:hidden">
          <EventDetailsSidebar event={event} locale={locale} />
        </div>

        {/* Map */}
        {event.place?.location?.lat && event.place?.location?.lng && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">{t('events.getting-there')}</h2>
            <div className="rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800">
              <Map places={[event.place]} />
            </div>
          </section>
        )}

        {/* Actions */}
        {!preview && <EventDetailsActions event={event} />}
      </article>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24">
        <EventDetailsSidebar event={event} locale={locale} />
      </aside>
    </div>
  );
};

export default EventDetails;
