import { z } from 'zod';
import { formSchema } from '@/app/features/EventForm/constants';

export type FormValues = z.input<typeof formSchema>;
