'use client';

import { FC, useMemo } from 'react';
import { Globe } from 'lucide-react';
import { LANGUAGES } from '@/app/constants';
import { Button } from '@/app/ui';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/ui';
import { usePathname, useRouter } from '@/i18n/navigation';

type LanguageSwitcherProps = {
  currentLocale: string;
};

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ currentLocale }) => {
  const pathname = usePathname();
  const router = useRouter();

  const current = useMemo(
    () => LANGUAGES.find(l => l.locale === currentLocale) ?? LANGUAGES[0],
    [currentLocale]
  );

  const handleSelect = (locale: string) => {
    router.replace(pathname, { locale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {current.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.filter(lang => lang.locale !== currentLocale).map(lang => (
          <DropdownMenuItem key={lang.locale} onSelect={() => handleSelect(lang.locale)}>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
