import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Brand, Footer, LanguageSwitcher, SubmitEventButton } from '@/app/features';
import { ThemeToggle } from '@/app/ui';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="dark bg-stone-900 text-stone-50">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-4">
            <Brand />
            <div className="flex items-center gap-3">
              <SubmitEventButton className="hidden sm:flex" />
              <ThemeToggle />
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t('common.metadata.title'),
    description: t('common.metadata.description'),
  };
}
