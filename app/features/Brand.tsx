import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

type Props = {
  hideOnMobile?: boolean;
};

const Brand = async ({ hideOnMobile }: Props) => {
  const t = await getTranslations('common');
  return (
    <Link href="/" className="hover:text-white flex items-center gap-1.5">
      <Image
        src="/square-orange.png"
        alt={t('metadata.title')}
        width={24}
        height={24}
        className="object-contain"
      />
      <span
        className={`text-md font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500 ${hideOnMobile ? 'hidden sm:inline' : ''}`}
      >
        {t('metadata.title')}
      </span>
    </Link>
  );
};

export default Brand;
