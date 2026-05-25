import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LeagueTable } from '../LeagueTable';
import type { StandingsEntry } from '../../types';

function makeEntry(overrides: Partial<StandingsEntry> & { id: string; shortName: string }): StandingsEntry {
  return {
    position: 1,
    team: { id: overrides.id, name: overrides.shortName, shortName: overrides.shortName },
    played: 10,
    won: 7,
    lost: 3,
    pointsFor: 800,
    pointsAgainst: 750,
    pointsDifference: 50,
    points: 14,
    ...overrides,
  };
}

const mockStandings: StandingsEntry[] = [
  makeEntry({ id: 't1', shortName: 'Alpha', position: 1, won: 9, lost: 1, pointsDifference: 80, points: 18 }),
  makeEntry({ id: 't2', shortName: 'Beta',  position: 2, won: 7, lost: 3, pointsDifference: 40, points: 14 }),
  makeEntry({ id: 't3', shortName: 'Gamma', position: 3, won: 5, lost: 5, pointsDifference: 10, points: 10 }),
  makeEntry({ id: 't4', shortName: 'Delta', position: 4, won: 3, lost: 7, pointsDifference: -30, points: 6 }),
  makeEntry({ id: 't5', shortName: 'Epsilon', position: 5, won: 1, lost: 9, pointsDifference: -100, points: 2 }),
];

function renderTable(standings = mockStandings, loading = false) {
  return render(
    <MemoryRouter>
      <LeagueTable standings={standings} loading={loading} />
    </MemoryRouter>
  );
}

function getTeamOrder() {
  return screen.getAllByRole('row').slice(1).map(row => {
    const el = row as HTMLTableRowElement;
    return el.cells[1]?.textContent?.trim();
  });
}

describe('LeagueTable', () => {
  it('renders all teams in default position order', () => {
    renderTable();
    const order = getTeamOrder();
    expect(order).toEqual(['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']);
  });

  it('shows loading spinner when loading', () => {
    renderTable([], true);
    expect(document.querySelector('.animate-spin')).toBeTruthy();
  });

  it('shows empty state when no standings', () => {
    renderTable([]);
    expect(screen.getByText(/No standings available/)).toBeTruthy();
  });

  it('sorts by wins descending on first click of W header', () => {
    renderTable();
    fireEvent.click(screen.getByRole('button', { name: /Sort by W/i }));
    const order = getTeamOrder();
    // Alpha (9W) first, Epsilon (1W) last
    expect(order[0]).toBe('Alpha');
    expect(order[4]).toBe('Epsilon');
  });

  it('toggles W sort to ascending on second click', () => {
    renderTable();
    const wBtn = screen.getByRole('button', { name: /Sort by W/i });
    fireEvent.click(wBtn); // desc
    fireEvent.click(wBtn); // asc
    const order = getTeamOrder();
    expect(order[0]).toBe('Epsilon');
    expect(order[4]).toBe('Alpha');
  });

  it('sorts by losses ascending on first click of L header', () => {
    renderTable();
    fireEvent.click(screen.getByRole('button', { name: /Sort by L/i }));
    const order = getTeamOrder();
    expect(order[0]).toBe('Alpha'); // 1 loss
    expect(order[4]).toBe('Epsilon'); // 9 losses
  });

  it('sorts by points descending on first click of Pts header', () => {
    renderTable();
    fireEvent.click(screen.getByRole('button', { name: /Sort by Pts/i }));
    const order = getTeamOrder();
    expect(order[0]).toBe('Alpha'); // 18 pts
    expect(order[4]).toBe('Epsilon'); // 2 pts
  });

  it('sorts by points difference descending on first click of +/- header', () => {
    renderTable();
    fireEvent.click(screen.getByRole('button', { name: /Sort by \+\/-/i }));
    const order = getTeamOrder();
    expect(order[0]).toBe('Alpha'); // +80
    expect(order[4]).toBe('Epsilon'); // -100
  });

  it('sorts by position on click of # header', () => {
    renderTable();
    // First sort by wins to disrupt order
    fireEvent.click(screen.getByRole('button', { name: /Sort by W/i }));
    // Then click # to restore position order
    fireEvent.click(screen.getByRole('button', { name: /Sort by position/i }));
    const order = getTeamOrder();
    expect(order).toEqual(['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']);
  });

  it('displays sort indicators on active column', () => {
    renderTable();
    fireEvent.click(screen.getByRole('button', { name: /Sort by Pts/i }));
    const ptsBtn = screen.getByRole('button', { name: /Sort by Pts/i });
    // aria-sort should be 'descending' after first click
    expect(ptsBtn).toHaveAttribute('aria-sort', 'descending');
  });

  it('toggles aria-sort between descending and ascending', () => {
    renderTable();
    const ptsBtn = screen.getByRole('button', { name: /Sort by Pts/i });
    fireEvent.click(ptsBtn);
    expect(ptsBtn).toHaveAttribute('aria-sort', 'descending');
    fireEvent.click(ptsBtn);
    expect(ptsBtn).toHaveAttribute('aria-sort', 'ascending');
  });

  it('does not mutate the original standings array', () => {
    const originalOrder = mockStandings.map(e => e.team.shortName);
    renderTable();
    fireEvent.click(screen.getByRole('button', { name: /Sort by W/i }));
    expect(mockStandings.map(e => e.team.shortName)).toEqual(originalOrder);
  });
});
