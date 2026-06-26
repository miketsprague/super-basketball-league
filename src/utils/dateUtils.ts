/**
 * Format a Date object as YYYY-MM-DD in local timezone.
 * Uses local date components to avoid UTC offset issues.
 */
export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a YYYY-MM-DD date string for display as a section header in fixture lists.
 * Returns "Today", "Tomorrow", "Yesterday", or a locale-formatted date string (en-GB).
 * Includes the year only when the date falls in a different calendar year from the reference.
 *
 * @param dateStr - Date in YYYY-MM-DD format
 * @param referenceDate - Reference point for "today" (defaults to now — pass in for testing)
 */
export function formatDateHeader(dateStr: string, referenceDate?: Date): string {
  const ref = referenceDate ?? new Date();
  const todayStr = toLocalDateString(ref);

  const tomorrow = new Date(ref);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = toLocalDateString(tomorrow);

  const yesterday = new Date(ref);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toLocalDateString(yesterday);

  if (dateStr === todayStr) return 'Today';
  if (dateStr === tomorrowStr) return 'Tomorrow';
  if (dateStr === yesterdayStr) return 'Yesterday';

  // Parse as noon local time to avoid timezone edge cases at midnight
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: date.getFullYear() !== ref.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Format a YYYY-MM-DD date string for display in match detail views.
 * Returns a locale-formatted string without Today/Tomorrow/Yesterday labels.
 *
 * @param dateStr - Date in YYYY-MM-DD format
 */
export function formatMatchDate(dateStr: string): string {
  // Parse as noon local time to avoid timezone edge cases at midnight
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/**
 * Format a match kick-off time string for display.
 * Returns the time string unchanged, or 'TBC' when the time is unknown.
 */
export function formatMatchTime(time: string | undefined | null): string {
  return time || 'TBC';
}
