import type { Event } from '@/app/types';

type CalendarEventData = {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  url?: string;
};

/**
 * Formats a date and time for calendar URLs (YYYYMMDDTHHmmssZ format)
 */
const formatCalendarDateTime = (date: string, time?: string): string => {
  const datePart = date.replace(/-/g, '');
  if (!time) {
    return `${datePart}T000000Z`;
  }
  // Time format is HH:mm, convert to HHmmss
  const timePart = time.replace(':', '') + '00';
  return `${datePart}T${timePart}Z`;
};

/**
 * Formats a date and time for ICS files (YYYYMMDDTHHmmss format, no Z)
 */
const formatICSDateTime = (date: string, time?: string): string => {
  const datePart = date.replace(/-/g, '');
  if (!time) {
    return `${datePart}T000000`;
  }
  const timePart = time.replace(':', '') + '00';
  return `${datePart}T${timePart}`;
};

/**
 * Generates a DTSTAMP value (current UTC time in ICS format)
 * Required field per RFC 5545
 */
const generateDTSTAMP = (): string => {
  return new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
};

/**
 * Extracts calendar event data from an Event object
 */
const getCalendarEventData = (event: Event, currentUrl: string): CalendarEventData => {
  const { schedule } = event;
  if (!schedule) {
    throw new Error('Event must have a schedule');
  }

  const location = event.place
    ? [event.place.name, event.place.address].filter(Boolean).join(', ')
    : undefined;

  return {
    title: event.title || 'Event',
    description: event.summary || '',
    startDate: schedule.startDate,
    endDate: schedule.endDate || schedule.startDate,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    location,
    url: currentUrl,
  };
};

/**
 * Generates a Google Calendar URL for adding an event
 */
export const getGoogleCalendarUrl = (event: Event, currentUrl: string): string => {
  const data = getCalendarEventData(event, currentUrl);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: data.title,
    dates: `${formatCalendarDateTime(data.startDate, data.startTime)}/${formatCalendarDateTime(
      data.endDate || data.startDate,
      data.endTime || data.startTime
    )}`,
  });

  if (data.description) {
    params.append('details', data.description);
  }
  if (data.location) {
    params.append('location', data.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generates an Outlook Calendar URL for adding an event
 */
export const getOutlookCalendarUrl = (event: Event, currentUrl: string): string => {
  const data = getCalendarEventData(event, currentUrl);
  const params = new URLSearchParams({
    subject: data.title,
    startdt: formatCalendarDateTime(data.startDate, data.startTime),
    enddt: formatCalendarDateTime(data.endDate || data.startDate, data.endTime || data.startTime),
  });

  if (data.description) {
    params.append('body', data.description);
  }
  if (data.location) {
    params.append('location', data.location);
  }

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

/**
 * Generates an ICS file content for Apple Calendar and other calendar apps
 */
export const generateICSFile = (event: Event, currentUrl: string): string => {
  const data = getCalendarEventData(event, currentUrl);
  const startDateTime = formatICSDateTime(data.startDate, data.startTime);
  const endDateTime = formatICSDateTime(
    data.endDate || data.startDate,
    data.endTime || data.startTime
  );

  // Escape text for ICS format (escape commas, semicolons, backslashes, newlines)
  const escapeICS = (text: string): string => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  };

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Whats On//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event._id}@gocastellon.com`,
    `DTSTAMP:${generateDTSTAMP()}`,
    `DTSTART:${startDateTime}`,
    `DTEND:${endDateTime}`,
    `SUMMARY:${escapeICS(data.title)}`,
  ];

  if (data.description) {
    lines.push(`DESCRIPTION:${escapeICS(data.description)}`);
  }

  if (data.location) {
    lines.push(`LOCATION:${escapeICS(data.location)}`);
  }

  if (data.url) {
    lines.push(`URL:${data.url}`);
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.join('\r\n');
};

/**
 * Triggers download of an ICS file
 */
export const downloadICSFile = (event: Event, currentUrl: string): void => {
  const icsContent = generateICSFile(event, currentUrl);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.slug || 'event'}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
