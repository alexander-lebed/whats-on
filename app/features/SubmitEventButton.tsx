'use client';
import { FC } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/app/ui';
import { Link } from '@/i18n/navigation';

const SubmitEventButton: FC = () => {
  const t = useTranslations('events');

  return (
    <Button as={Link} href="/events/create" variant="light" size="sm" className="text-sm">
      {t('submit-event-button')}
    </Button>
  );
};

export default SubmitEventButton;
