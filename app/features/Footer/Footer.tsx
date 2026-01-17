import { getTranslations } from 'next-intl/server';
import { Brand } from '@/app/features';
import { Link } from '@/i18n/navigation';

const Footer = async () => {
  const t = await getTranslations('common');

  return (
    <footer className="bg-stone-50 py-12 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Brand */}
          <div className="flex flex-col gap-1">
            <Brand />
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-x-8 sm:gap-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-orange-500 transition-colors"
                >
                  {t('footer.about.project')}
                </Link>
              </li>
              <li>
                <Link
                  href="/for-organizers"
                  className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-orange-500 transition-colors"
                >
                  {t('footer.for-organizers')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-orange-500 transition-colors"
                >
                  {t('footer.about.contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-orange-500 transition-colors"
                >
                  {t('footer.about.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-orange-500 transition-colors"
                >
                  {t('footer.about.cookie')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
