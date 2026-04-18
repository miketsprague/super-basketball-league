import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LeagueSelector } from '../LeagueSelector';
import type { League } from '../../types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const leagues: League[] = [
  { id: 'slb', name: 'Super League Basketball', shortName: 'SLB', country: 'UK' },
  { id: 'euroleague', name: 'EuroLeague', shortName: 'EL', country: 'Europe' },
  { id: 'eurocup', name: 'EuroCup', shortName: 'EC', country: 'Europe' },
];

function renderSelector(props: Partial<Parameters<typeof LeagueSelector>[0]> = {}) {
  const defaults = {
    leagues,
    selectedLeague: leagues[0],
    onLeagueChange: vi.fn(),
  };
  return render(
    <MemoryRouter>
      <LeagueSelector {...defaults} {...props} />
    </MemoryRouter>
  );
}

describe('LeagueSelector', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders all league buttons', () => {
    renderSelector();
    expect(screen.getByText('SLB')).toBeInTheDocument();
    expect(screen.getByText('EL')).toBeInTheDocument();
    expect(screen.getByText('EC')).toBeInTheDocument();
  });

  it('highlights the selected league', () => {
    renderSelector({ selectedLeague: leagues[1] });
    const elButton = screen.getByText('EL').closest('button')!;
    expect(elButton).toHaveClass('bg-orange-500');
  });

  it('does not highlight non-selected leagues', () => {
    renderSelector({ selectedLeague: leagues[0] });
    const elButton = screen.getByText('EL').closest('button')!;
    expect(elButton).not.toHaveClass('bg-orange-500');
  });

  it('calls onLeagueChange when a league button is clicked', () => {
    const onLeagueChange = vi.fn();
    renderSelector({ onLeagueChange });
    fireEvent.click(screen.getByText('EL').closest('button')!);
    expect(onLeagueChange).toHaveBeenCalledWith(leagues[1]);
  });

  it('calls onLeagueChange with the correct league object', () => {
    const onLeagueChange = vi.fn();
    renderSelector({ onLeagueChange });
    fireEvent.click(screen.getByText('EC').closest('button')!);
    expect(onLeagueChange).toHaveBeenCalledWith(leagues[2]);
  });

  it('shows loading skeleton when loading=true', () => {
    const { container } = renderSelector({ loading: true });
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('does not render league buttons while loading', () => {
    renderSelector({ loading: true });
    expect(screen.queryByText('SLB')).not.toBeInTheDocument();
    expect(screen.queryByText('EL')).not.toBeInTheDocument();
  });

  it('shows My Team button when followedTeamName is set', () => {
    renderSelector({ followedTeamName: 'Barcelona' });
    expect(screen.getByText('My Team')).toBeInTheDocument();
  });

  it('does not show My Team button when followedTeamName is null', () => {
    renderSelector({ followedTeamName: null });
    expect(screen.queryByText('My Team')).not.toBeInTheDocument();
  });

  it('does not show My Team button when followedTeamName is undefined', () => {
    renderSelector();
    expect(screen.queryByText('My Team')).not.toBeInTheDocument();
  });

  it('navigates to team page when My Team is clicked', () => {
    renderSelector({ followedTeamName: 'Real Madrid' });
    fireEvent.click(screen.getByText('My Team').closest('button')!);
    expect(mockNavigate).toHaveBeenCalledWith('/team/Real%20Madrid');
  });

  it('URL-encodes the team name when navigating', () => {
    renderSelector({ followedTeamName: 'Anadolu Efes S.K.' });
    fireEvent.click(screen.getByText('My Team').closest('button')!);
    expect(mockNavigate).toHaveBeenCalledWith('/team/Anadolu%20Efes%20S.K.');
  });

  it('renders a basketball emoji for each league', () => {
    renderSelector();
    const emojis = screen.getAllByText('🏀');
    expect(emojis.length).toBe(leagues.length);
  });

  it('renders the star emoji in the My Team button', () => {
    renderSelector({ followedTeamName: 'Barcelona' });
    expect(screen.getByText('★')).toBeInTheDocument();
  });

  it('shows My Team button before league buttons', () => {
    renderSelector({ followedTeamName: 'Barcelona' });
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('My Team');
  });

  it('renders with a single league', () => {
    renderSelector({ leagues: [leagues[0]], selectedLeague: leagues[0] });
    expect(screen.getByText('SLB')).toBeInTheDocument();
  });
});
