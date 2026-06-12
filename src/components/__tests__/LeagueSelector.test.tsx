import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LeagueSelector } from '../LeagueSelector';
import type { League } from '../../types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const leagues: League[] = [
  { id: 'slb', name: 'Super League Basketball', shortName: 'SLB', country: 'Greece' },
  { id: 'euroleague', name: 'EuroLeague', shortName: 'EL', country: 'Europe' },
  { id: 'eurocup', name: 'EuroCup', shortName: 'EC', country: 'Europe' },
];

function renderLeagueSelector(overrides: Partial<Parameters<typeof LeagueSelector>[0]> = {}) {
  const defaults = {
    leagues,
    selectedLeague: leagues[0],
    onLeagueChange: vi.fn(),
    loading: false,
    followedTeamName: null,
  };
  return render(
    <MemoryRouter>
      <LeagueSelector {...defaults} {...overrides} />
    </MemoryRouter>
  );
}

describe('LeagueSelector', () => {
  it('renders all league buttons', () => {
    renderLeagueSelector();

    expect(screen.getByRole('button', { name: /SLB/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /EL/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /EC/i })).toBeInTheDocument();
  });

  it('highlights the selected league', () => {
    renderLeagueSelector({ selectedLeague: leagues[1] });

    const elButton = screen.getByRole('button', { name: /EL/i });
    expect(elButton.className).toContain('bg-orange-500');

    const slbButton = screen.getByRole('button', { name: /SLB/i });
    expect(slbButton.className).not.toContain('bg-orange-500');
  });

  it('calls onLeagueChange with clicked league', () => {
    const onLeagueChange = vi.fn();
    renderLeagueSelector({ onLeagueChange });

    fireEvent.click(screen.getByRole('button', { name: /EL/i }));

    expect(onLeagueChange).toHaveBeenCalledWith(leagues[1]);
  });

  it('shows loading skeleton when loading is true', () => {
    renderLeagueSelector({ loading: true });

    // Skeleton divs are present; no actual league buttons
    expect(screen.queryByRole('button', { name: /SLB/i })).not.toBeInTheDocument();
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders My Team button when followedTeamName is provided', () => {
    renderLeagueSelector({ followedTeamName: 'Panathinaikos' });

    expect(screen.getByRole('button', { name: /my team/i })).toBeInTheDocument();
  });

  it('does not render My Team button when followedTeamName is null', () => {
    renderLeagueSelector({ followedTeamName: null });

    expect(screen.queryByRole('button', { name: /my team/i })).not.toBeInTheDocument();
  });

  it('navigates to team view when My Team button is clicked', () => {
    renderLeagueSelector({ followedTeamName: 'Panathinaikos' });

    fireEvent.click(screen.getByRole('button', { name: /my team/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/team/Panathinaikos');
  });

  it('URL-encodes the team name when navigating', () => {
    renderLeagueSelector({ followedTeamName: 'Real Madrid Basketball' });

    fireEvent.click(screen.getByRole('button', { name: /my team/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/team/Real%20Madrid%20Basketball');
  });
});
