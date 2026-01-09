export type EventFormValues = {
  title: Record<string, string>;
  summary: Record<string, string>;
  scheduleMode: 'single' | 'range';
  categories: string[];
  isDigital: boolean;
  isFree: boolean;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  weekdays: string[];
  contactEmail: string;
  contactPhone: string;
  website?: string;
  ticketUrl?: string;
  price?: number;
  placeSelected: boolean;
  image?: unknown; // FileList
};
