'use client';

import { cloneElement, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useBreakpoint } from '@/app/hooks';
import { Category } from '@/app/types';
import { Button } from '@/app/ui';

type Props = {
  isActive: boolean;
  category: Category;
  onClick: (category: Category) => void;
};

const CategoryButton = ({ category, isActive, onClick }: Props) => {
  const t = useTranslations();
  const { isMobile } = useBreakpoint();

  const onPress = useCallback(() => onClick(category), [category, onClick]);

  return (
    <Button
      key={category.slug}
      variant={isActive ? 'solid' : 'flat'}
      color={isActive ? 'primary' : undefined}
      radius="full"
      size={isMobile ? 'sm' : undefined}
      aria-label={t(category.i18n)}
      onPress={onPress}
      className={isActive ? 'text-white' : 'outline outline-default-200 dark:outline-0'}
    >
      {cloneElement(category.iconComponent, { size: '1rem', 'aria-hidden': true })}
      <span>{t(category.i18n)}</span>
    </Button>
  );
};

export default CategoryButton;
