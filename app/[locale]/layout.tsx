import { ReactNode } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { cookies } from 'next/headers';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { THEME_COOKIE_KEY } from '@/app/constants';
import { HeroProvider } from '@/app/providers';
import { routing } from '@/i18n/routing';

const inter = Inter({
  variable: '--font-inter',
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
  const themeCookie = cookieStore.get(THEME_COOKIE_KEY)?.value;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${themeCookie || ''}`}
      suppressHydrationWarning
    >
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const cookieKey = '${THEME_COOKIE_KEY}';
                const getCookie = (key) => {
                  const entry = document.cookie.split('; ').find(row => row.startsWith(key + '='));
                  return entry ? entry.split('=')[1] : null;
                };
                const cookieValue = getCookie(cookieKey);
                let theme = cookieValue;
                if (!theme) {
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  theme = prefersDark ? 'dark' : 'light';
                }
                if (theme === 'dark' || theme === 'light') {
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                }
              })();
            `,
          }}
        />
      </Head>
      <body className="antialiased">
        <HeroProvider locale={locale}>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </HeroProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}
