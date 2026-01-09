'use client';

import type { FC } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import EventDetails from '@/app/features/EventDetails/EventDetails';
import type { Event, Locale } from '@/app/types';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@/app/ui';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
};

export const EventPreviewModal: FC<Props> = ({ isOpen, onClose, event }) => {
  const locale = useLocale() as Locale;
  const t = useTranslations('events.create');
  const tCommon = useTranslations('common');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        body: 'p-0',
        base: 'h-[100vh] sm:h-[90vh] max-h-[100vh] sm:max-h-[90vh]',
      }}
    >
      <ModalContent className="max-w-[960px]">
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-default-200">
              {t('preview-modal-title')}
            </ModalHeader>
            <ModalBody className="p-6">
              {event && <EventDetails event={event} locale={locale} />}
            </ModalBody>
            <ModalFooter className="border-t border-default-200">
              <Button variant="light" onPress={onClose}>
                {tCommon('close')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
