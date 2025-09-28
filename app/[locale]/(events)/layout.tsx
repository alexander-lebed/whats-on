import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/app/features';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  return (
    <>
      <header className="bg-background text-foreground">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end py-4">
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">{children}</div>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t('common.metadata.title'),
    description: t('common.metadata.description'),
  };
}
