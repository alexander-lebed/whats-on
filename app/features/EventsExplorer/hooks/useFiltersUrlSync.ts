import { useEffect, useRef, useTransition, useState, Dispatch, SetStateAction } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import { EventFilters } from '../types';
import { parseParamsToFilters, serializeFiltersToParams } from '../utils';

/**
 * Hook that syncs EventFilters state with URL search params
 * - On init: reads URL params and initializes filters state
 * - On filters change: updates URL params using useTransition for non-blocking updates
 * - Returns [filters, setFilters, isPending]
 */
export const useFiltersUrlSync = (): [EventFilters, Dispatch<SetStateAction<EventFilters>>] => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const isInitialMount = useRef(true);

  // Initialize filters from URL params on mount
  const [filters, setFilters] = useState<EventFilters>(() => {
    return parseParamsToFilters(new URLSearchParams(searchParams));
  });

  // Sync URL params when filters change (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const newParams = serializeFiltersToParams(filters);
    const newSearch = newParams.toString();
    const currentSearch = searchParams.toString();

    // Only update URL if params actually changed
    if (newSearch !== currentSearch) {
      startTransition(() => {
        router.replace(`${pathname}${newSearch ? `?${newSearch}` : ''}`, { scroll: false });
      });
    }
  }, [filters, pathname, router, searchParams]);

  return [filters, setFilters];
};
