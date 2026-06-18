import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Match } from '../../types';
import {
  generateICalContent,
  formatICalDateTime,
  escapeICalText,
  downloadCalendar,
} from '../calendarExport';

const makeMatch = (overrides: Partial<Match> = {}): Match => ({
  id: 'match-1',
  homeTeam: { id: 'team-a', name: 'Home Team', shortName: 'HOME' },
  awayTeam: { id: 'team-b', name: 'Away Team', shortName: 'AWAY' },
  date: '2026-09-15',
  time: '19:00',
  venue: 'The Arena',
  status: 'scheduled',
  leagueName: 'Super League Basketball',
  ...overrides,
});

describe('formatICalDateTime', () => {
  it('formats a normal date and time', () => {
    expect(formatICalDateTime('2026-09-15', '19:00')).toBe('20260915T190000Z');
  });

  it('applies offset in minutes', () => {
    expect(formatICalDateTime('2026-09-15', '19:00', 120)).toBe('20260915T210000Z');
  });

  it('defaults to 00:00 when time is TBC', () => {
    expect(formatICalDateTime('2026-09-15', 'TBC')).toBe('20260915T000000Z');
  });

  it('applies offset to TBC time', () => {
    expect(formatICalDateTime('2026-09-15', 'TBC', 60)).toBe('20260915T010000Z');
  });

  it('pads single-digit month and day', () => {
    expect(formatICalDateTime('2026-01-05', '09:05')).toBe('20260105T090500Z');
  });

  it('wraps hours correctly with large offset', () => {
    expect(formatICalDateTime('2026-09-15', '23:00', 120)).toBe('20260915T010000Z');
  });
});

describe('escapeICalText', () => {
  it('escapes backslashes', () => {
    expect(escapeICalText('a\\b')).toBe('a\\\\b');
  });

  it('escapes semicolons', () => {
    expect(escapeICalText('a;b')).toBe('a\\;b');
  });

  it('escapes commas', () => {
    expect(escapeICalText('a,b')).toBe('a\\,b');
  });

  it('escapes newlines', () => {
    expect(escapeICalText('a\nb')).toBe('a\\nb');
  });

  it('returns plain text unchanged', () => {
    expect(escapeICalText('Home Team v Away Team')).toBe('Home Team v Away Team');
  });
});

describe('generateICalContent', () => {
  it('generates a valid VCALENDAR header and footer', () => {
    const content = generateICalContent([], 'Test Team');
    expect(content).toContain('BEGIN:VCALENDAR');
    expect(content).toContain('END:VCALENDAR');
    expect(content).toContain('VERSION:2.0');
    expect(content).toContain('PRODID:-//Super Basketball League//EN');
  });

  it('includes the team name in X-WR-CALNAME', () => {
    const content = generateICalContent([], 'BC Barcelona');
    expect(content).toContain('X-WR-CALNAME:BC Barcelona Fixtures');
  });

  it('generates one VEVENT per scheduled match', () => {
    const matches = [makeMatch({ id: 'a' }), makeMatch({ id: 'b' })];
    const content = generateICalContent(matches, 'Home Team');
    const eventCount = (content.match(/BEGIN:VEVENT/g) ?? []).length;
    expect(eventCount).toBe(2);
  });

  it('excludes completed matches', () => {
    const matches = [
      makeMatch({ id: 'a', status: 'completed', homeScore: 80, awayScore: 75 }),
      makeMatch({ id: 'b', status: 'scheduled' }),
    ];
    const content = generateICalContent(matches, 'Home Team');
    const eventCount = (content.match(/BEGIN:VEVENT/g) ?? []).length;
    expect(eventCount).toBe(1);
  });

  it('excludes live matches', () => {
    const matches = [
      makeMatch({ id: 'a', status: 'live' }),
      makeMatch({ id: 'b', status: 'scheduled' }),
    ];
    const content = generateICalContent(matches, 'Home Team');
    const eventCount = (content.match(/BEGIN:VEVENT/g) ?? []).length;
    expect(eventCount).toBe(1);
  });

  it('includes SUMMARY with home v away team names', () => {
    const match = makeMatch();
    const content = generateICalContent([match], 'Home Team');
    expect(content).toContain('SUMMARY:Home Team v Away Team');
  });

  it('includes LOCATION when venue is not TBC', () => {
    const match = makeMatch({ venue: 'The Arena' });
    const content = generateICalContent([match], 'Home Team');
    expect(content).toContain('LOCATION:The Arena');
  });

  it('omits LOCATION when venue is TBC', () => {
    const match = makeMatch({ venue: 'TBC' });
    const content = generateICalContent([match], 'Home Team');
    expect(content).not.toContain('LOCATION:');
  });

  it('sets DTEND 2 hours after DTSTART', () => {
    const match = makeMatch({ date: '2026-09-15', time: '19:00' });
    const content = generateICalContent([match], 'Home Team');
    expect(content).toContain('DTSTART:20260915T190000Z');
    expect(content).toContain('DTEND:20260915T210000Z');
  });

  it('uses league name in DESCRIPTION when available', () => {
    const match = makeMatch({ leagueName: 'Super League Basketball' });
    const content = generateICalContent([match], 'Home Team');
    expect(content).toContain('DESCRIPTION:Super League Basketball fixture');
  });

  it('falls back to generic description when no league name', () => {
    const match = makeMatch({ leagueName: undefined });
    const content = generateICalContent([match], 'Home Team');
    expect(content).toContain('DESCRIPTION:Basketball fixture');
  });

  it('uses CRLF line endings (RFC 5545)', () => {
    const content = generateICalContent([], 'Test Team');
    expect(content).toContain('\r\n');
  });

  it('includes unique UID per event', () => {
    const match = makeMatch({ id: 'abc123' });
    const content = generateICalContent([match], 'Home Team');
    expect(content).toContain('UID:match-abc123@super-basketball-league');
  });

  it('returns only VCALENDAR wrapper when no upcoming matches', () => {
    const content = generateICalContent([], 'Home Team');
    expect(content).not.toContain('BEGIN:VEVENT');
  });
});

describe('downloadCalendar', () => {
  let createObjectURLSpy: ReturnType<typeof vi.fn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>;
  let appendChildSpy: ReturnType<typeof vi.fn>;
  let clickSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    createObjectURLSpy = vi.fn(() => 'blob:mock-url');
    revokeObjectURLSpy = vi.fn();
    clickSpy = vi.fn();

    Object.defineProperty(URL, 'createObjectURL', { value: createObjectURLSpy, writable: true });
    Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURLSpy, writable: true });

    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((el) => {
      if (el instanceof HTMLAnchorElement) {
        el.click = clickSpy as unknown as () => void;
      }
      return el;
    });
    vi.spyOn(document.body, 'removeChild').mockImplementation((el) => el);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates an object URL and clicks the link', () => {
    downloadCalendar('BEGIN:VCALENDAR\r\nEND:VCALENDAR', 'fixtures.ics');
    expect(createObjectURLSpy).toHaveBeenCalledOnce();
    expect(clickSpy).toHaveBeenCalledOnce();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
  });

  it('sets the correct filename on the anchor', () => {
    let capturedLink: HTMLAnchorElement | null = null;
    appendChildSpy.mockImplementation((el) => {
      capturedLink = el as HTMLAnchorElement;
      capturedLink.click = clickSpy as unknown as () => void;
      return el;
    });

    downloadCalendar('content', 'my-team-fixtures.ics');
    expect(capturedLink).not.toBeNull();
    expect((capturedLink as unknown as HTMLAnchorElement).download).toBe('my-team-fixtures.ics');
  });
});
