import { SITE_HOST } from '@/app/constants';
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
 * Formats a date and time for calendar URLs (YYYYMMDD or YYYYMMDDTHHmmss format)
 * No Z suffix - times are local to the specified timezone (Europe/Madrid)
 */
const formatCalendarDateTime = (date: string, time?: string): string => {
  const datePart = date.replace(/-/g, '');
  if (!time) {
    return datePart; // Date-only for all-day events
  }
  // Time format is HH:mm, convert to HHmmss
  const timePart = time.replace(':', '') + '00';
  return `${datePart}T${timePart}`;
};

/**
 * Formats a date for ICS files (YYYYMMDD format for all-day events)
 */
const formatICSDate = (date: string): string => {
  return date.replace(/-/g, '');
};

/**
 * Formats a date and time for ICS files (YYYYMMDDTHHmmss format)
 */
const formatICSDateTime = (date: string, time: string): string => {
  const datePart = date.replace(/-/g, '');
  const timePart = time.replace(':', '') + '00';
  return `${datePart}T${timePart}`;
};

/**
 * Adds one day to a date string (YYYY-MM-DD format)
 * Used for calculating exclusive end date for all-day events per RFC 5545
 */
const addOneDay = (date: string): string => {
  const d = new Date(date + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
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
 * Folds long lines per RFC 5545 (max 75 octets per line)
 * Lines are folded with CRLF followed by a space
 */
const foldLine = (line: string, maxLength = 75): string => {
  if (line.length <= maxLength) {
    return line;
  }
  const parts: string[] = [];
  let remaining = line;
  let isFirst = true;
  while (remaining.length > 0) {
    // First line: 75 chars, subsequent: 74 (account for leading space)
    const chunkSize = isFirst ? maxLength : maxLength - 1;
    parts.push(remaining.slice(0, chunkSize));
    remaining = remaining.slice(chunkSize);
    isFirst = false;
  }
  return parts.join('\r\n ');
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
    ctz: 'Europe/Madrid',
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
 * Formats a date and time for Outlook Calendar URLs (YYYY-MM-DDTHH:mm:ss format)
 */
const formatOutlookDateTime = (date: string, time?: string): string => {
  if (!time) {
    return date;
  }
  return `${date}T${time}:00`;
};

/**
 * Generates an Outlook Calendar URL for adding an event
 */
export const getOutlookCalendarUrl = (event: Event, currentUrl: string): string => {
  const data = getCalendarEventData(event, currentUrl);
  const params = new URLSearchParams({
    subject: data.title,
    startdt: formatOutlookDateTime(data.startDate, data.startTime),
    enddt: formatOutlookDateTime(data.endDate || data.startDate, data.endTime || data.startTime),
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
 * VTIMEZONE component for Europe/Madrid timezone
 * Includes standard time (CET) and daylight saving time (CEST) rules
 */
const VTIMEZONE_EUROPE_MADRID = `BEGIN:VTIMEZONE
TZID:Europe/Madrid
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE`;

/**
 * Generates an ICS file content for Apple Calendar and other calendar apps
 */
export const generateICSFile = (event: Event, currentUrl: string): string => {
  const data = getCalendarEventData(event, currentUrl);
  const isAllDay = !data.startTime;

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
    'PRODID:-//Go Castellon//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  // Add VTIMEZONE component for timed events
  if (!isAllDay) {
    lines.push(VTIMEZONE_EUROPE_MADRID);
  }

  lines.push('BEGIN:VEVENT', `UID:${event._id}@${SITE_HOST}`, `DTSTAMP:${generateDTSTAMP()}`);

  if (isAllDay) {
    // All-day event: use VALUE=DATE format (YYYYMMDD)
    // Per RFC 5545, DTEND for all-day events is exclusive (day after last day)
    const startDate = formatICSDate(data.startDate);
    const endDate = formatICSDate(addOneDay(data.endDate || data.startDate));
    lines.push(`DTSTART;VALUE=DATE:${startDate}`);
    lines.push(`DTEND;VALUE=DATE:${endDate}`);
  } else {
    // Timed event: use TZID parameter with Europe/Madrid timezone
    const startDateTime = formatICSDateTime(data.startDate, data.startTime!);
    const endDateTime = formatICSDateTime(
      data.endDate || data.startDate,
      data.endTime || data.startTime!
    );
    lines.push(`DTSTART;TZID=Europe/Madrid:${startDateTime}`);
    lines.push(`DTEND;TZID=Europe/Madrid:${endDateTime}`);
  }

  lines.push(foldLine(`SUMMARY:${escapeICS(data.title)}`));

  if (data.description) {
    lines.push(foldLine(`DESCRIPTION:${escapeICS(data.description)}`));
  }

  if (data.location) {
    lines.push(foldLine(`LOCATION:${escapeICS(data.location)}`));
  }

  if (data.url) {
    lines.push(`URL:${data.url}`);
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.join('\r\n') + '\r\n';
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
