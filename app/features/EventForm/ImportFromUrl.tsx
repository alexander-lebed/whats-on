'use client';

import { FC, useState } from 'react';
import { useTranslations } from 'next-intl';
import { EventFormValues } from '@/app/types';
import { Button, Input } from '@/app/ui';

type ImportedEventData = Partial<Omit<EventFormValues, 'image' | 'placeSelected'>>;

type ImportFromUrlProps = {
  onImport: (data: ImportedEventData) => void;
};

type ImportState = 'idle' | 'loading' | 'error';

export const ImportFromUrl: FC<ImportFromUrlProps> = ({ onImport }) => {
  const t = useTranslations('events');
  const [url, setUrl] = useState('');
  const [state, setState] = useState<ImportState>('idle');

  const handleImport = async (): Promise<void> => {
    if (!url.trim()) {
      return;
    }

    setState('loading');

    try {
      const response = await fetch('/api/events/import-from-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        setState('error');
        return;
      }

      const result = (await response.json()) as { data: ImportedEventData };

      if (!result.data) {
        setState('error');
        return;
      }

      onImport(result.data);
      setState('idle');
      setUrl('');
    } catch (error) {
      console.error('Import error:', error);
      setState('error');
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-bold">{t('import.section-title')}</h2>
      <div className="flex gap-3 items-start">
        <Input
          className="flex-1"
          label={t('import.url-label')}
          placeholder={t('import.url-placeholder')}
          variant="faded"
          type="url"
          value={url}
          onValueChange={setUrl}
          isDisabled={state === 'loading'}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleImport();
            }
          }}
        />
        <Button
          variant="flat"
          color="primary"
          className="mt-6"
          isLoading={state === 'loading'}
          isDisabled={!url.trim() || state === 'loading'}
          onPress={handleImport}
        >
          {state === 'loading' ? t('import.loading') : t('import.button')}
        </Button>
      </div>
      {state === 'error' && <p className="text-sm text-danger">{t('import.error')}</p>}
    </section>
  );
};

export default ImportFromUrl;
