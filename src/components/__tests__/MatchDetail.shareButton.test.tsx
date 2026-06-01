import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MatchDetail } from '../MatchDetail';
import type { MatchDetails } from '../../types';

vi.mock('../../services/dataProvider');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

import { fetchMatchDetails } from '../../services/dataProvider';
const mockFetchMatchDetails = vi.mocked(fetchMatchDetails);

function makeMatchDetails(overrides: Partial<MatchDetails> = {}): MatchDetails {
  return {
    id: 'match-1',
    homeTeam: { id: 'h1', name: 'Home Team', shortName: 'HOM' },
    awayTeam: { id: 'a1', name: 'Away Team', shortName: 'AWY' },
    date: '2026-05-20',
    time: '19:00',
    venue: 'Test Arena',
    status: 'completed',
    homeScore: 90,
    awayScore: 80,
    ...overrides,
  };
}

function renderMatchDetail(matchId = 'match-1') {
  return render(
    <MemoryRouter initialEntries={[`/match/${matchId}`]}>
      <Routes>
        <Route path="/match/:matchId" element={<MatchDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('MatchDetail — share button', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockFetchMatchDetails.mockResolvedValue(makeMatchDetails());

    // Default: no native share, but clipboard is available
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true, writable: true });
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the share button', async () => {
    renderMatchDetail();
    await screen.findByRole('button', { name: 'Share match' });
    expect(screen.getByRole('button', { name: 'Share match' })).toBeDefined();
  });

  it('uses navigator.share when available', async () => {
    const shareFn = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: shareFn, configurable: true, writable: true });

    renderMatchDetail();
    const shareBtn = await screen.findByRole('button', { name: 'Share match' });
    fireEvent.click(shareBtn);

    await waitFor(() => {
      expect(shareFn).toHaveBeenCalledOnce();
    });
    const callArg = shareFn.mock.calls[0][0] as { title: string; url: string };
    expect(callArg.title).toContain('HOM');
    expect(callArg.title).toContain('AWY');
  });

  it('copies URL to clipboard when navigator.share is unavailable', async () => {
    renderMatchDetail();
    const shareBtn = await screen.findByRole('button', { name: 'Share match' });
    fireEvent.click(shareBtn);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledOnce();
    });
  });

  it('shows "Link copied!" feedback after clipboard copy', async () => {
    renderMatchDetail();
    const shareBtn = await screen.findByRole('button', { name: 'Share match' });
    fireEvent.click(shareBtn);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Link copied!' })).toBeDefined();
    });
  });

  it('resets share button label after 2 seconds', async () => {
    vi.useFakeTimers();

    renderMatchDetail();

    // Flush useEffect + async fetch resolution
    await act(async () => {
      await Promise.resolve();
    });

    const shareBtn = screen.getByRole('button', { name: 'Share match' });
    fireEvent.click(shareBtn);

    // Flush clipboard writeText promise
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByRole('button', { name: 'Link copied!' })).toBeDefined();

    act(() => { vi.advanceTimersByTime(2100); });

    expect(screen.getByRole('button', { name: 'Share match' })).toBeDefined();

    vi.useRealTimers();
  });
});
