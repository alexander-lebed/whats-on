import { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { HeroProvider } from '@/app/providers';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function MainLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    // Let Next.js render 404
    return null;
  }

  setRequestLocale(locale);

  // SSR: read theme from cookie and apply to <html> to avoid reset on locale navigation
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('theme')?.value;

  return (
    <html lang={locale} className={themeCookie} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <HeroProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </HeroProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}
