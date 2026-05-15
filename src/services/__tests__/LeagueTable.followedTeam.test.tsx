import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LeagueTable } from '../../components/LeagueTable';
import type { StandingsEntry } from '../../types';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

function makeEntry(
  id: string,
  name: string,
  shortName: string,
  position: number,
): StandingsEntry {
  return {
    position,
    team: { id, name, shortName },
    played: 20,
    won: 10,
    lost: 10,
    pointsFor: 1800,
    pointsAgainst: 1800,
    pointsDifference: 0,
    points: 10,
  };
}

const standings: StandingsEntry[] = [
  makeEntry('1', 'London Lions', 'Lions', 1),
  makeEntry('2', 'Bristol Flyers', 'Flyers', 2),
  makeEntry('3', 'Manchester Giants', 'Giants', 3),
];

function renderTable(followedTeamName?: string) {
  return render(
    <MemoryRouter>
      <LeagueTable standings={standings} loading={false} followedTeamName={followedTeamName} />
    </MemoryRouter>,
  );
}

describe('LeagueTable followed-team highlight', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all teams without highlight when no followed team', () => {
    renderTable();
    expect(screen.queryByLabelText('followed team')).toBeNull();
  });

  it('shows a star indicator for the followed team (by full name)', () => {
    renderTable('London Lions');
    const star = screen.getByLabelText('followed team');
    expect(star).toBeTruthy();
    expect(star.closest('button')?.textContent).toContain('Lions');
  });

  it('shows a star indicator for the followed team (by short name)', () => {
    renderTable('Flyers');
    const star = screen.getByLabelText('followed team');
    expect(star.closest('button')?.textContent).toContain('Flyers');
  });

  it('is case-insensitive when matching followed team', () => {
    renderTable('LONDON LIONS');
    expect(screen.getByLabelText('followed team')).toBeTruthy();
  });

  it('shows no star when followed team is not in standings', () => {
    renderTable('Unknown Team');
    expect(screen.queryByLabelText('followed team')).toBeNull();
  });

  it('only highlights exactly one team even with multiple entries', () => {
    renderTable('London Lions');
    const stars = screen.getAllByLabelText('followed team');
    expect(stars).toHaveLength(1);
  });
});
