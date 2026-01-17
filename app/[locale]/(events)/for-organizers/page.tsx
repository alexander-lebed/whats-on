import {
  CheckCircle2,
  ClipboardList,
  Shield,
  ArrowRight,
  Rocket,
  Handshake,
  Drama,
  Landmark,
  Music,
  Send,
  Eye,
} from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('organizers');
  return {
    title: t('page-title'),
  };
}

const ForOrganizersPage = async () => {
  const t = await getTranslations('organizers');

  const whoItems = t.raw('who-its-for.items') as string[];
  const whatYouGetItems = t.raw('what-you-get.items') as Array<{
    label: string;
    description: string;
  }>;
  const howItWorksSteps = t.raw('how-it-works.steps') as Array<{
    number: string;
    text: string;
  }>;
  const whatToIncludeItems = t.raw('what-to-include.items') as Array<{
    label: string;
    description: string;
  }>;
  const adminActions = t.raw('moderation.admin-actions') as string[];
  const declineReasons = t.raw('moderation.decline-reasons') as string[];

  const whoIcons = [Landmark, Drama, Music, Handshake];
  const howIcons = [Send, Eye, Rocket];

  return (
    <main className="bg-stone-50/50 dark:bg-stone-950 rounded-t-3xl overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-transparent dark:from-stone-900/50 dark:to-transparent -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            {t('badge')}
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-50 mb-8 font-display">
            {t('intro.title')}
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            {t('intro.description')}
          </p>
          <div className="flex justify-center">
            <Link
              href="/events/create"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 text-white dark:text-stone-900 font-medium px-8 py-4 rounded-full transition-all shadow-xl shadow-stone-900/10 dark:shadow-none hover:scale-105 active:scale-95 text-lg no-underline group"
            >
              {t('cta.submit-event')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-32">
        {/* Who it's for */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              {t('who-its-for.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whoItems.map((item, index) => {
              const Icon = whoIcons[index % whoIcons.length];
              return (
                <div
                  key={index}
                  className="group bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center gap-4"
                >
                  <div className="w-12 h-12 bg-orange-50 dark:bg-stone-800 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="font-medium text-stone-900 dark:text-stone-200">{item}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              {t('how-it-works.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorksSteps.map((step, index) => {
              const Icon = howIcons[index % howIcons.length];
              return (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="w-20 h-20 bg-white dark:bg-stone-900 rounded-3xl shadow-lg ring-1 ring-stone-900/5 dark:ring-stone-800 flex items-center justify-center mb-8 z-10 group-hover:-translate-y-1 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-orange-500" />
                  </div>
                  {/* Step Connector (Desktop) */}
                  {index !== howItWorksSteps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-stone-200 to-transparent dark:from-stone-800" />
                  )}
                  <p className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-3">
                    {t('how-it-works.step-prefix')} {step.number}
                  </p>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed max-w-xs">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* What you get */}
        <section>
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 sm:p-12 lg:p-16 ring-1 ring-stone-900/5 dark:ring-stone-800 shadow-xl shadow-stone-900/5 dark:shadow-none">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight mb-4">
                {t('what-you-get.title')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
              {whatYouGetItems.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100 mb-2">
                      {item.label}
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Moderation & Guidelines */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* What to include (Good) */}
          <div className="bg-green-50/50 dark:bg-green-950/10 rounded-3xl p-8 sm:p-10 border border-green-100 dark:border-green-900/20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <ClipboardList className="w-6 h-6 text-green-700 dark:text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                {t('what-to-include.title')}
              </h2>
            </div>
            <ul className="space-y-6">
              {whatToIncludeItems.map((item, index) => (
                <li key={index} className="flex gap-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="text-stone-700 dark:text-stone-300">
                    <span className="font-bold text-stone-900 dark:text-stone-100 block mb-1">
                      {item.label}
                    </span>
                    <span className="text-sm opacity-90">{item.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Moderation (Bad/Warning) */}
          <div className="bg-stone-50 dark:bg-stone-900 rounded-3xl p-8 sm:p-10 border border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-lg">
                <Shield className="w-6 h-6 text-stone-600 dark:text-stone-400" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                {t('moderation.title')}
              </h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {t('moderation.decline-reasons-intro')}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-stone-600 dark:text-stone-400">
                  {declineReasons.map((reason, index) => (
                    <li key={index} className="flex gap-2 items-start">
                      <span className="text-red-400 select-none">×</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 border-t border-stone-200 dark:border-stone-800">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-4 text-sm uppercase tracking-wider opacity-60">
                  {t('moderation.admin-rights')}
                </h3>
                <p className="text-stone-500 dark:text-stone-500 text-sm leading-relaxed mb-4">
                  {t('moderation.description')}
                </p>
                <ul className="space-y-2 text-sm text-stone-500 dark:text-stone-500">
                  {adminActions.map((action, index) => (
                    <li key={index} className="flex gap-2">
                      • {action}
                    </li>
                  ))}
                </ul>
                <p className="text-stone-400 dark:text-stone-600 text-xs mt-6 italic">
                  {t('moderation.decline-note')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="relative rounded-[2.5rem] bg-orange-600 dark:bg-orange-700 overflow-hidden px-8 py-20 text-center">
          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="text-orange-100 text-lg mb-10 leading-relaxed opacity-90">
              {t('contact.cta')}
            </p>
            <Link
              href="/events/create"
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-10 py-4 rounded-full hover:bg-orange-50 transition-all shadow-xl shadow-orange-900/20 hover:scale-105 active:scale-95"
            >
              {t('cta.submit-event')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ForOrganizersPage;
