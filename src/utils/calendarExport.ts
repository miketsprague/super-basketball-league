import type { Match } from '../types';

/**
 * Generates an iCal (.ics) calendar string for a team's upcoming fixtures.
 * Each match becomes a VEVENT with a 2-hour duration.
 * Only scheduled (upcoming) matches are included.
 */
export function generateICalContent(matches: Match[], teamName: string): string {
  const upcoming = matches.filter((m) => m.status === 'scheduled');

  const events = upcoming.map((match) => {
    const dtStart = formatICalDateTime(match.date, match.time);
    const dtEnd = formatICalDateTime(match.date, match.time, 120);
    const summary = `${match.homeTeam.name} v ${match.awayTeam.name}`;
    const description = match.leagueName ? `${match.leagueName} fixture` : 'Basketball fixture';
    const location = match.venue !== 'TBC' ? match.venue : '';
    const uid = `match-${match.id}@super-basketball-league`;

    const lines = [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${escapeICalText(summary)}`,
      `DESCRIPTION:${escapeICalText(description)}`,
      ...(location ? [`LOCATION:${escapeICalText(location)}`] : []),
      'STATUS:CONFIRMED',
      `DTSTAMP:${formatICalDateTime(
        new Date().toISOString().slice(0, 10),
        new Date().toISOString().slice(11, 16),
      )}`,
      'END:VEVENT',
    ];

    return lines.join('\r\n');
  });

  const calName = `${teamName} Fixtures`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Super Basketball League//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICalText(calName)}`,
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Format a YYYY-MM-DD date and HH:MM time as an iCal UTC date-time string.
 * If time is 'TBC', defaults to 00:00.
 * offsetMinutes is added to the time (e.g., 120 for 2-hour duration).
 */
export function formatICalDateTime(date: string, time: string, offsetMinutes: number = 0): string {
  const [yearStr, monthStr, dayStr] = date.split('-');
  const year = parseInt(yearStr ?? '2000', 10);
  const month = parseInt(monthStr ?? '1', 10);
  const day = parseInt(dayStr ?? '1', 10);

  let hours = 0;
  let minutes = 0;

  if (time !== 'TBC' && /^\d{1,2}:\d{2}$/.test(time)) {
    const [h, m] = time.split(':').map(Number);
    hours = h ?? 0;
    minutes = m ?? 0;
  }

  const totalMinutes = hours * 60 + minutes + offsetMinutes;
  const finalHours = Math.floor(totalMinutes / 60) % 24;
  const finalMinutes = totalMinutes % 60;

  return (
    `${String(year).padStart(4, '0')}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}` +
    `T${String(finalHours).padStart(2, '0')}${String(finalMinutes).padStart(2, '0')}00Z`
  );
}

/**
 * Escape special characters in iCal text property values (RFC 5545 §3.3.11).
 */
export function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Trigger a browser download of the iCal content as a .ics file.
 */
export function downloadCalendar(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
