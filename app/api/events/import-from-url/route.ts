import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { CATEGORIES, WEEKDAYS } from '@/app/constants';
import { EventFormValues } from '@/app/types';

export const runtime = 'nodejs';

const CATEGORY_SLUGS = CATEGORIES.map(c => c.slug);
const WEEKDAY_SLUGS = WEEKDAYS.map(w => w.slug);

/**
 * Schema for OpenAI Structured Outputs.
 * Uses z.enum() to constrain categories and weekdays to valid values.
 * All fields use nullable() since AI may not find all information.
 */
const aiImportSchema = z.object({
  title: z
    .object({
      en: z.string().nullable(),
      es: z.string().nullable(),
    })
    .describe('Event title in English and Spanish'),
  summary: z
    .object({
      en: z.string().nullable(),
      es: z.string().nullable(),
    })
    .describe('Event description in English and Spanish'),
  categories: z.array(z.enum(CATEGORY_SLUGS)).describe('Event categories (max 3)'),
  scheduleMode: z.enum(['single', 'range']).describe('single for one day, range for multiple days'),
  startDate: z.string().nullable().describe('Start date in YYYY-MM-DD format'),
  endDate: z.string().nullable().describe('End date in YYYY-MM-DD format'),
  startTime: z.string().nullable().describe('Start time in HH:mm format'),
  endTime: z.string().nullable().describe('End time in HH:mm format'),
  weekdays: z.array(z.enum(WEEKDAY_SLUGS)).describe('Weekdays when event occurs (for range mode)'),
  isDigital: z.boolean().describe('Whether the event is online/digital'),
  isFree: z.boolean().describe('Whether the event is free'),
  price: z.number().nullable().describe('Ticket price if not free'),
  website: z.string().nullable().describe('Official event page URL'),
  ticketUrl: z.string().nullable().describe('Tickets URL'),
  contactEmail: z.string().nullable().describe('Contact email'),
  contactPhone: z.string().nullable().describe('Contact phone'),
});

/**
 * Strip HTML tags and extract text content from HTML string.
 */
const extractTextFromHtml = (html: string): string => {
  // Remove script and style elements
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
};

/**
 * Build the system prompt for OpenAI.
 * Schema is enforced by zodTextFormat, so no JSON structure needed here.
 */
const buildSystemPrompt = (): string => {
  return `You are an event data extractor. Given webpage content about an event, extract structured event information.

IMPORTANT RULES:
1. Only use information explicitly present in the page content. Do NOT guess or infer missing information.
2. For title/header and summary/overview get exact text. If text is only in one language, provide translations in English (en) or Spanish (es).
3. Select up to 3 categories that match the event type.
4. Use ISO date format YYYY-MM-DD for dates. If year is not present, use current year.
5. Use HH:mm format for times (24-hour).
6. If event spans multiple days, set scheduleMode to "range", otherwise "single".
7. For range events, include the weekdays when the event occurs.
8. Set fields to null if information is not found in the content.
9. isDigital should be true only for online/virtual events.
10. isFree should be true if the event has free entry, false if tickets cost money.

FIELD-SPECIFIC GUIDANCE:
- ticketUrl: Look for ticket purchase links like "Comprar entradas","Entradas", "Comprar", "Reservar", "Tickets", or links to ticketing platforms (Eventbrite, Ticketmaster, etc.).
- website: Look for official event page URL, organizer website, or "more info" links. Use the source URL if no other website is found.
- endTime: Look for event end time, closing time, or time ranges like "19:00 - 22:00", "De 11.00h a 13.00h". If only a duration is mentioned (e.g., "2 hours"), calculate the end time from the start time.`;
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as { url?: string };
    const url = body.url?.trim();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY environment variable is not set');
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    // Fetch webpage content with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 sec timeout

    let htmlContent: string;
    try {
      const response = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; EventImporter/1.0; +https://go-castellon.vercel.app)',
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json({ error: 'Could not fetch the URL' }, { status: 422 });
      }

      htmlContent = await response.text();
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);
      return NextResponse.json({ error: 'Could not fetch the URL' }, { status: 422 });
    }

    // Extract text content from HTML
    const textContent = extractTextFromHtml(htmlContent);

    // Limit content length to avoid token limits (roughly 12k chars ~= 3k tokens)
    const truncatedContent = textContent.slice(0, 12000);

    if (truncatedContent.length < 50) {
      return NextResponse.json(
        { error: 'Page content is too short to extract event data' },
        { status: 422 }
      );
    }

    // Call OpenAI with Structured Outputs using Responses API
    const openai = new OpenAI({ apiKey });

    const response = await openai.responses.parse({
      model: 'gpt-4o-2024-08-06', // Model that supports Structured Outputs
      input: [
        { role: 'system', content: buildSystemPrompt() },
        {
          role: 'user',
          content: `Extract event information from this webpage content:\n\n${truncatedContent}`,
        },
      ],
      text: {
        format: zodTextFormat(aiImportSchema, 'event_data'),
      },
      temperature: 0.1,
    });

    // Handle incomplete responses
    if (response.status === 'incomplete') {
      console.error('Incomplete response:', response.incomplete_details?.reason);
      return NextResponse.json({ error: 'Could not extract event data' }, { status: 422 });
    }

    // Handle refusals - check if the first output is a message with refusal content
    const firstOutput = response.output[0];
    if (firstOutput && 'content' in firstOutput && firstOutput.content) {
      const firstContent = firstOutput.content[0];
      if (firstContent?.type === 'refusal') {
        console.error('Model refused:', firstContent.refusal);
        return NextResponse.json({ error: 'Could not extract event data' }, { status: 422 });
      }
    }

    // Get auto-parsed result
    const eventData = response.output_parsed;

    if (!eventData) {
      return NextResponse.json({ error: 'Could not extract event data' }, { status: 422 });
    }

    // Transform nullable fields to match the expected form data format
    // Convert { en: string | null, es: string | null } to { en: string, es: string }
    const transformedData: Partial<EventFormValues> = {
      title: {
        en: eventData.title.en ?? '',
        es: eventData.title.es ?? '',
      },
      summary: {
        en: eventData.summary.en ?? '',
        es: eventData.summary.es ?? '',
      },
      categories: eventData.categories,
      scheduleMode: eventData.scheduleMode,
      startDate: eventData.startDate ?? undefined,
      endDate: eventData.endDate ?? undefined,
      startTime: eventData.startTime ?? undefined,
      endTime: eventData.endTime ?? undefined,
      weekdays: eventData.weekdays,
      isDigital: eventData.isDigital,
      isFree: eventData.isFree,
      price: eventData.price ?? undefined,
      website: eventData.website ?? undefined,
      ticketUrl: eventData.ticketUrl ?? undefined,
      contactEmail: eventData.contactEmail ?? '',
      contactPhone: eventData.contactPhone ?? '',
    };

    return NextResponse.json({ data: transformedData }, { status: 200 });
  } catch (error) {
    console.error('Import from URL error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
