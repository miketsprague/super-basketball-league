import { describe, it, expect } from 'vitest';
import {
  toLocalDateString,
  formatDateHeader,
  formatMatchDate,
  formatMatchTime,
} from '../dateUtils';

// ─── toLocalDateString ───────────────────────────────────────────────────────

describe('toLocalDateString', () => {
  it('formats a date as YYYY-MM-DD', () => {
    // Use a Date constructed from year/month/day to avoid timezone assumptions
    const date = new Date(2026, 5, 14); // Month is 0-indexed: June = 5
    expect(toLocalDateString(date)).toBe('2026-06-14');
  });

  it('pads month and day with leading zeros', () => {
    const date = new Date(2026, 0, 5); // January 5
    expect(toLocalDateString(date)).toBe('2026-01-05');
  });

  it('handles end-of-year dates', () => {
    const date = new Date(2025, 11, 31); // December 31
    expect(toLocalDateString(date)).toBe('2025-12-31');
  });

  it('uses local timezone (not UTC)', () => {
    // The result should match the local year/month/day, not UTC
    const date = new Date(2026, 5, 14); // June 14, local time
    const result = toLocalDateString(date);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result).toBe(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
  });
});

// ─── formatDateHeader ────────────────────────────────────────────────────────

describe('formatDateHeader', () => {
  // Use a fixed reference date for deterministic tests
  const REF = new Date(2026, 5, 14); // Sunday, 14 June 2026

  it('returns "Today" for the reference date', () => {
    expect(formatDateHeader('2026-06-14', REF)).toBe('Today');
  });

  it('returns "Tomorrow" for the day after the reference', () => {
    expect(formatDateHeader('2026-06-15', REF)).toBe('Tomorrow');
  });

  it('returns "Yesterday" for the day before the reference', () => {
    expect(formatDateHeader('2026-06-13', REF)).toBe('Yesterday');
  });

  it('returns a locale-formatted date for other dates in the same year', () => {
    const result = formatDateHeader('2026-03-10', REF);
    // Should be something like "Tuesday, 10 March" (no year since same year as ref)
    expect(result).toContain('March');
    expect(result).toContain('10');
    expect(result).not.toContain('2026');
  });

  it('includes the year when the date is in a different year', () => {
    const result = formatDateHeader('2025-11-20', REF);
    expect(result).toContain('2025');
  });

  it('includes the year for a future year', () => {
    const result = formatDateHeader('2027-02-01', REF);
    expect(result).toContain('2027');
  });

  it('uses the current date when no reference is provided', () => {
    // Today relative to right-now — just verify it returns a string
    const today = toLocalDateString(new Date());
    const result = formatDateHeader(today);
    expect(result).toBe('Today');
  });

  it('handles month/year boundaries for Tomorrow', () => {
    // Reference: last day of May; tomorrow is June 1
    const mayEnd = new Date(2026, 4, 31); // May 31
    expect(formatDateHeader('2026-06-01', mayEnd)).toBe('Tomorrow');
  });

  it('handles month/year boundaries for Yesterday', () => {
    // Reference: June 1; yesterday is May 31
    const juneStart = new Date(2026, 5, 1); // June 1
    expect(formatDateHeader('2026-05-31', juneStart)).toBe('Yesterday');
  });

  it('handles year boundary for Tomorrow', () => {
    // Reference: Dec 31; tomorrow is Jan 1 next year
    const dec31 = new Date(2025, 11, 31); // Dec 31, 2025
    expect(formatDateHeader('2026-01-01', dec31)).toBe('Tomorrow');
  });

  it('handles year boundary for Yesterday', () => {
    // Reference: Jan 1; yesterday is Dec 31 previous year
    const jan1 = new Date(2026, 0, 1); // Jan 1, 2026
    expect(formatDateHeader('2025-12-31', jan1)).toBe('Yesterday');
  });
});

// ─── formatMatchDate ─────────────────────────────────────────────────────────

describe('formatMatchDate', () => {
  it('returns a formatted date string', () => {
    // June 14, 2026 is a Sunday
    const result = formatMatchDate('2026-06-14');
    expect(result).toContain('June');
    expect(result).toContain('14');
  });

  it('includes the weekday', () => {
    // June 14, 2026 is a Sunday
    const result = formatMatchDate('2026-06-14');
    expect(result).toContain('Sunday');
  });

  it('does not return "Today" or "Tomorrow" labels', () => {
    const today = toLocalDateString(new Date());
    const result = formatMatchDate(today);
    expect(result).not.toBe('Today');
    expect(result).not.toBe('Tomorrow');
    expect(result).not.toBe('Yesterday');
  });

  it('handles dates from different months', () => {
    const result = formatMatchDate('2026-01-20');
    expect(result).toContain('January');
    expect(result).toContain('20');
  });
});

// ─── formatMatchTime ─────────────────────────────────────────────────────────

describe('formatMatchTime', () => {
  it('returns the time string unchanged when provided', () => {
    expect(formatMatchTime('19:30')).toBe('19:30');
    expect(formatMatchTime('14:00')).toBe('14:00');
  });

  it('returns "TBC" for an empty string', () => {
    expect(formatMatchTime('')).toBe('TBC');
  });

  it('returns "TBC" for undefined', () => {
    expect(formatMatchTime(undefined)).toBe('TBC');
  });

  it('returns "TBC" for null', () => {
    expect(formatMatchTime(null)).toBe('TBC');
  });

  it('preserves unusual time formats', () => {
    expect(formatMatchTime('TBD')).toBe('TBD');
    expect(formatMatchTime('20:00 CET')).toBe('20:00 CET');
  });
});
