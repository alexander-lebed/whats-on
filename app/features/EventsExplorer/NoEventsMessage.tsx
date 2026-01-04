import { useTranslations } from 'next-intl';

type Props = {
  hasActiveFilters: boolean;
};

const NoEventsMessage = ({ hasActiveFilters }: Props) => {
  const t = useTranslations();
  return (
    <div
      className="flex flex-col items-center justify-center py-10 text-center"
      role="status"
      aria-live="polite"
    >
      <p className="text-lg text-default-600">{t('events.empty-state.no-events')}</p>
      {hasActiveFilters && (
        <p className="mt-2 text-sm text-default-500">
          {t('events.empty-state.try-adjusting-filters')}
        </p>
      )}
    </div>
  );
};

export default NoEventsMessage;
