import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { fetchEvents } from '@/app/api';
import { LANGUAGES } from '@/app/constants';
import { EventDetails } from '@/app/features';
import { Event, Locale } from '@/app/types';
import EventScript from './EventScript';

export const revalidate = 300;

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

async function getEvent(locale: Locale, slug: string): Promise<Event | undefined> {
  const events = await fetchEvents(locale);
  return events.find(e => e.slug === slug);
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  const event = await getEvent(locale, slug);
  if (!event) {
    return notFound();
  }

  return (
    <>
      <EventScript event={event} />
      <main className="py-4 sm:py-8">
        <div className="mx-auto w-full max-w-[900px] px-1 sm:px-6 lg:px-0">
          <EventDetails event={event} locale={locale} />
        </div>
      </main>
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = await getEvent(locale, slug);
  const t = await getTranslations();
  if (!event) {
    return { title: t('common.metadata.title') };
  }

  const title = event.title || t('common.metadata.title');
  const description = event.summary || t('common.metadata.description');
  const canonical = `https://gocastellon.com/${locale}/events/${event.slug}`;
  const languages = Object.fromEntries(
    LANGUAGES.map(l => [l.locale, `https://gocastellon.com/${l.locale}/events/${event.slug}`])
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical,
      images: event.image?.asset
        ? [
            {
              url: `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production/${event.image.asset._ref.split('-').slice(1, 3).join('-')}.jpg`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export async function generateStaticParams({ params }: { params: { locale: Locale } }) {
  const events = await fetchEvents(params.locale);
  return events.map(e => ({ slug: e.slug }));
}

// export function generateViewport() {
//   // return { themeColor: '#ffffff' };
//   return { themeColor: 'var(--color-primary)' };
// }
