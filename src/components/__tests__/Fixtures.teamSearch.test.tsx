import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Fixtures } from '../Fixtures';
import type { Match } from '../../types';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const makeMatch = (id: string, homeShort: string, awayShort: string, homeName: string, awayName: string, date: string, status: Match['status'] = 'scheduled'): Match => ({
  id,
  homeTeam: { id: `h-${id}`, name: homeName, shortName: homeShort },
  awayTeam: { id: `a-${id}`, name: awayName, shortName: awayShort },
  date,
  time: '20:00',
  status,
  venue: 'Test Arena',
  homeScore: status === 'completed' ? 80 : undefined,
  awayScore: status === 'completed' ? 75 : undefined,
});

// Use a future date so matches appear in the default 'fixtures' tab
const FUTURE = '2099-01-15';

const futureMatches: Match[] = [
  makeMatch('1', 'PAO', 'OLY', 'Panathinaikos', 'Olympiacos', FUTURE),
  makeMatch('2', 'CSK', 'MAD', 'CSKA Moscow', 'Real Madrid', FUTURE),
  makeMatch('3', 'BAR', 'EFE', 'Barcelona', 'Efes', FUTURE),
];

const renderFixtures = (matches: Match[]) =>
  render(
    <MemoryRouter initialEntries={['/?tab=fixtures']}>
      <Fixtures matches={matches} loading={false} />
    </MemoryRouter>
  );

describe('Fixtures team search', () => {
  it('renders the search input', () => {
    renderFixtures(futureMatches);
    expect(screen.getByRole('searchbox', { name: /search by team/i })).toBeInTheDocument();
  });

  it('shows all matches when search is empty', () => {
    renderFixtures(futureMatches);
    expect(screen.getByText('PAO')).toBeInTheDocument();
    expect(screen.getByText('CSK')).toBeInTheDocument();
    expect(screen.getByText('BAR')).toBeInTheDocument();
  });

  it('filters matches by short team name (case-insensitive)', () => {
    renderFixtures(futureMatches);
    const input = screen.getByRole('searchbox', { name: /search by team/i });
    fireEvent.change(input, { target: { value: 'pao' } });
    expect(screen.getByText('PAO')).toBeInTheDocument();
    expect(screen.queryByText('CSK')).not.toBeInTheDocument();
    expect(screen.queryByText('BAR')).not.toBeInTheDocument();
  });

  it('filters matches by full team name', () => {
    renderFixtures(futureMatches);
    const input = screen.getByRole('searchbox', { name: /search by team/i });
    fireEvent.change(input, { target: { value: 'Barcelona' } });
    expect(screen.getByText('BAR')).toBeInTheDocument();
    expect(screen.queryByText('PAO')).not.toBeInTheDocument();
    expect(screen.queryByText('CSK')).not.toBeInTheDocument();
  });

  it('matches away team as well as home team', () => {
    renderFixtures(futureMatches);
    const input = screen.getByRole('searchbox', { name: /search by team/i });
    fireEvent.change(input, { target: { value: 'MAD' } });
    // CSK vs MAD — away match
    expect(screen.getByText('MAD')).toBeInTheDocument();
    expect(screen.queryByText('PAO')).not.toBeInTheDocument();
  });

  it('shows "no matches found" message when search has no results', () => {
    renderFixtures(futureMatches);
    const input = screen.getByRole('searchbox', { name: /search by team/i });
    fireEvent.change(input, { target: { value: 'ZZZZZ' } });
    expect(screen.getByText(/no matches found for "ZZZZZ"/i)).toBeInTheDocument();
  });

  it('clears search and shows all matches again after clearing input', () => {
    renderFixtures(futureMatches);
    const input = screen.getByRole('searchbox', { name: /search by team/i });
    fireEvent.change(input, { target: { value: 'pao' } });
    expect(screen.queryByText('CSK')).not.toBeInTheDocument();
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getByText('CSK')).toBeInTheDocument();
  });
});
