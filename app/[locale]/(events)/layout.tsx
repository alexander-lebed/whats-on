import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/app/features';
import { ThemeToggle } from '@/app/ui';
import { Link } from '@/i18n/navigation';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('events');
  return (
    <>
      <header className="dark bg-stone-900 text-stone-50">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-4">
            <Link href="/" className="hover:text-white">
              {t('title')}
            </Link>
            <div className="flex items-center gap-3">
              <Link href={{ pathname: '/events/create' }} className="hover:text-white text-sm">
                Submit new event
              </Link>
              <ThemeToggle />
              <LanguageSwitcher currentLocale={locale} />
            </div>
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
