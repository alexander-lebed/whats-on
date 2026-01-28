'use client';

import { cloneElement, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Category } from '@/app/types';
import { Button } from '@/app/ui';

type Props = {
  isActive: boolean;
  category: Category;
  onClick: (category: Category) => void;
};

const CategoryButton = ({ category, isActive, onClick }: Props) => {
  const t = useTranslations();

  const onPress = useCallback(() => onClick(category), [category, onClick]);

  return (
    <Button
      key={category.slug}
      variant={isActive ? 'solid' : 'flat'}
      color={isActive ? 'primary' : undefined}
      radius="full"
      aria-label={t(category.i18n)}
      onPress={onPress}
      className={`flex-shrink-0 ${isActive ? 'text-white' : 'outline outline-default-200 dark:outline-0'}`}
    >
      {cloneElement(category.iconComponent, { size: '1rem', 'aria-hidden': true })}
      <span>{t(category.i18n)}</span>
    </Button>
  );
};

export default CategoryButton;
