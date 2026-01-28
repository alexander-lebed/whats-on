'use client';
import { useTranslations } from 'next-intl';
import { Button, ButtonProps } from '@/app/ui';
import { Link } from '@/i18n/navigation';

const SubmitEventButton = (props: ButtonProps) => {
  const t = useTranslations('events');

  return (
    <Button as={Link} href="/events/create" variant="light" {...props}>
      {t('submit-event-button')}
    </Button>
  );
};

export default SubmitEventButton;
