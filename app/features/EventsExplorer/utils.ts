import { parseDate, type DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';
import { EventFilters } from './types';

const PARAM_CATEGORIES = 'categories';
const PARAM_START_DATE = 'startDate';
const PARAM_END_DATE = 'endDate';

/**
 * Serializes EventFilters to URLSearchParams
 * - categories: comma-separated slugs (e.g., "music,sports")
 * - dateRange: ISO date strings for start/end dates
 */
export const serializeFiltersToParams = (filters: EventFilters): URLSearchParams => {
  const params = new URLSearchParams();

  // Serialize categories
  if (filters.categories.size > 0) {
    params.set(PARAM_CATEGORIES, Array.from(filters.categories).join(','));
  }

  // Serialize date range
  if (filters.dateRange) {
    params.set(PARAM_START_DATE, filters.dateRange.start.toString());
    params.set(PARAM_END_DATE, filters.dateRange.end.toString());
  }

  return params;
};

/**
 * Parses URLSearchParams to EventFilters
 * - Parse categories back to Set<string>
 * - Parse dates using parseDate from @internationalized/date
 */
export const parseParamsToFilters = (params: URLSearchParams): EventFilters => {
  const filters: EventFilters = {
    categories: new Set(),
    dateRange: null,
  };

  // Parse categories
  const categoriesParam = params.get(PARAM_CATEGORIES);
  if (categoriesParam) {
    const categorySlugs = categoriesParam.split(',').filter(Boolean);
    filters.categories = new Set(categorySlugs);
  }

  // Parse date range
  const startDateParam = params.get(PARAM_START_DATE);
  const endDateParam = params.get(PARAM_END_DATE);
  if (startDateParam && endDateParam) {
    try {
      const start = parseDate(startDateParam);
      const end = parseDate(endDateParam);
      filters.dateRange = { start, end } as RangeValue<DateValue>;
    } catch {
      // Invalid date format, leave dateRange as null
    }
  }

  return filters;
};
