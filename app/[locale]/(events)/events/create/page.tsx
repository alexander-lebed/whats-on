import { getTranslations } from 'next-intl/server';
import { EventForm } from '@/app/features';

export default async function CreateEventPage() {
  const t = await getTranslations('events');
  return (
    <div className="mx-auto w-full max-w-[600px] px-1 sm:px-6 lg:px-0">
      <h1 className="my-5 text-2xl font-semibold">
        {t('title')} · {t('create.page-title')}
      </h1>
      <EventForm />
    </div>
  );
}
