'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { Share2, CalendarPlus, Copy, Check, ExternalLink, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Event } from '@/app/types';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@/app/ui';
import {
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
  downloadICSFile,
} from '@/app/utils/calendarLinks';
import {
  canUseNativeShare,
  shareNative,
  copyToClipboard,
  getFacebookShareUrl,
  getWhatsAppShareUrl,
} from '@/app/utils/share';

type Props = {
  event: Event;
};

/** Returns the current page URL (computed at call time for client-side navigation support) */
const getCurrentUrl = (): string => (typeof window !== 'undefined' ? window.location.href : '');

const EventDetailsActions: FC<Props> = ({ event }) => {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const showCopiedFeedback = (): void => {
    setCopied(true);
    if (copiedTimeoutRef.current) {
      clearTimeout(copiedTimeoutRef.current);
    }
    copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (): Promise<void> => {
    const url = getCurrentUrl();
    if (canUseNativeShare()) {
      const shared = await shareNative({
        title: event.title || 'Event',
        text: event.summary || '',
        url,
      });
      if (shared) {
        return;
      }
    }
    // Fallback: copy to clipboard
    const success = await copyToClipboard(url);
    if (success) {
      showCopiedFeedback();
    }
  };

  const handleCopyLink = async (): Promise<void> => {
    const success = await copyToClipboard(getCurrentUrl());
    if (success) {
      showCopiedFeedback();
    }
  };

  const handleShareFacebook = (): void => {
    window.open(getFacebookShareUrl(getCurrentUrl()), '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = (): void => {
    window.open(
      getWhatsAppShareUrl(getCurrentUrl(), event.title || undefined),
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleGoogleCalendar = (): void => {
    window.open(getGoogleCalendarUrl(event, getCurrentUrl()), '_blank', 'noopener,noreferrer');
  };

  const handleOutlookCalendar = (): void => {
    window.open(getOutlookCalendarUrl(event, getCurrentUrl()), '_blank', 'noopener,noreferrer');
  };

  const handleAppleCalendar = (): void => {
    downloadICSFile(event, getCurrentUrl());
  };

  const hasSchedule = Boolean(event.schedule);

  return (
    <section
      aria-labelledby="actions-heading"
      className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-stone-100/50 p-6 dark:border-none dark:bg-transparent dark:p-0"
    >
      <h2 id="actions-heading" className="text-lg font-bold text-foreground">
        {t('events.actions-section')}
      </h2>
      <div className="flex flex-wrap gap-3">
        {/* Share Dropdown */}
        <Dropdown>
          <DropdownTrigger asChild>
            <Button variant="bordered" startContent={<Share2 className="h-4 w-4" />}>
              {t('events.share-event')}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            onAction={key => {
              switch (key) {
                case 'native':
                  handleShare();
                  break;
                case 'copy':
                  handleCopyLink();
                  break;
                case 'facebook':
                  handleShareFacebook();
                  break;
                case 'whatsapp':
                  handleShareWhatsApp();
                  break;
              }
            }}
          >
            {canUseNativeShare() ? (
              <DropdownItem key="native" startContent={<Share2 className="h-4 w-4" />}>
                {t('events.share-native')}
              </DropdownItem>
            ) : null}
            <DropdownItem
              key="copy"
              startContent={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            >
              {copied ? t('events.link-copied') : t('events.copy-link')}
            </DropdownItem>
            <DropdownItem key="facebook" startContent={<ExternalLink className="h-4 w-4" />}>
              {t('events.share-facebook')}
            </DropdownItem>
            <DropdownItem key="whatsapp" startContent={<ExternalLink className="h-4 w-4" />}>
              {t('events.share-whatsapp')}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Calendar Dropdown - only shown if event has schedule */}
        {hasSchedule ? (
          <Dropdown>
            <DropdownTrigger asChild>
              <Button variant="bordered" startContent={<CalendarPlus className="h-4 w-4" />}>
                {t('events.add-to-calendar')}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={key => {
                switch (key) {
                  case 'google':
                    handleGoogleCalendar();
                    break;
                  case 'apple':
                    handleAppleCalendar();
                    break;
                  case 'outlook':
                    handleOutlookCalendar();
                    break;
                }
              }}
            >
              <DropdownItem key="google" startContent={<ExternalLink className="h-4 w-4" />}>
                {t('events.google-calendar')}
              </DropdownItem>
              <DropdownItem key="apple" startContent={<Download className="h-4 w-4" />}>
                {t('events.apple-calendar')}
              </DropdownItem>
              <DropdownItem key="outlook" startContent={<ExternalLink className="h-4 w-4" />}>
                {t('events.outlook-calendar')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : null}
      </div>
    </section>
  );
};

export default EventDetailsActions;
