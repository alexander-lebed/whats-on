'use client';

import { FC, useMemo } from 'react';
import { Globe } from 'lucide-react';
import { LANGUAGES } from '@/app/constants';
import { useBreakpoint } from '@/app/hooks';
import { Button } from '@/app/ui';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@/app/ui';
import { usePathname, useRouter } from '@/i18n/navigation';

type LanguageSwitcherProps = {
  currentLocale: string;
};

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ currentLocale }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile } = useBreakpoint();

  const current = useMemo(
    () => LANGUAGES.find(l => l.locale === currentLocale) ?? LANGUAGES[0],
    [currentLocale]
  );

  const handleSelect = (locale: string) => {
    router.replace(`${pathname}${window.location.search}`, { locale });
  };

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="light" size="sm" isIconOnly={isMobile}>
          <Globe className="h-4 w-4" />
          {!isMobile && current.name}
        </Button>
      </DropdownTrigger>
      <DropdownMenu onAction={key => handleSelect(key as string)}>
        {LANGUAGES.filter(lang => lang.locale !== currentLocale).map(lang => (
          <DropdownItem variant="flat" key={lang.locale} id={lang.locale}>
            {lang.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
