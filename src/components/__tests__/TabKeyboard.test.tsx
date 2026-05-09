import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

// Mock all service calls
vi.mock('../../services/dataProvider', () => ({
  fetchAllData: vi.fn().mockResolvedValue({ matches: [], standings: [] }),
  fetchLeagues: vi.fn().mockResolvedValue([]),
  APIError: class APIError extends Error {
    statusCode?: number;
    constructor(message: string, statusCode?: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
}));

vi.mock('../../services/leagues', () => ({
  DEFAULT_LEAGUE: { id: 'SLB', name: 'Super League Basketball', shortName: 'SLB' },
  predefinedLeagues: [
    { id: 'SLB', name: 'Super League Basketball', shortName: 'SLB' },
    { id: 'EL', name: 'EuroLeague', shortName: 'EL' },
  ],
  getLeagueConfig: vi.fn().mockReturnValue({ hasStandings: true }),
}));

vi.mock('../../services/teamStorage', () => ({
  getFollowedTeam: vi.fn().mockReturnValue(null),
}));

vi.mock('../../components/Fixtures', () => ({
  Fixtures: () => <div data-testid="fixtures-panel-content">Fixtures</div>,
}));

vi.mock('../../components/LeagueTable', () => ({
  LeagueTable: () => <div data-testid="league-table-content">League Table</div>,
}));

vi.mock('../../components/LeagueSelector', () => ({
  LeagueSelector: () => <div data-testid="league-selector">League Selector</div>,
}));

function renderApp() {
  return render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
}

describe('Tab keyboard navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders both tabs with correct ARIA attributes', async () => {
    renderApp();

    const fixturesTab = await screen.findByRole('tab', { name: 'Fixtures & Results' });
    const tableTab = await screen.findByRole('tab', { name: 'League Table' });

    expect(fixturesTab).toHaveAttribute('aria-selected', 'true');
    expect(tableTab).toHaveAttribute('aria-selected', 'false');
    expect(fixturesTab).toHaveAttribute('tabindex', '0');
    expect(tableTab).toHaveAttribute('tabindex', '-1');
  });

  it('renders tablist and tabpanel ARIA roles', async () => {
    renderApp();

    await screen.findByRole('tablist');
    const tabpanel = await screen.findByRole('tabpanel');
    expect(tabpanel).toHaveAttribute('id', 'fixtures-panel');
    expect(tabpanel).toHaveAttribute('aria-labelledby', 'fixtures-tab');
  });

  it('ArrowRight moves from Fixtures to League Table tab', async () => {
    renderApp();

    const fixturesTab = await screen.findByRole('tab', { name: 'Fixtures & Results' });
    const tablist = screen.getByRole('tablist');

    fixturesTab.focus();
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });

    await waitFor(() => {
      const tableTab = screen.getByRole('tab', { name: 'League Table' });
      expect(tableTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('ArrowLeft moves from League Table back to Fixtures tab', async () => {
    renderApp();

    // First navigate to table tab
    const tableTab = await screen.findByRole('tab', { name: 'League Table' });
    fireEvent.click(tableTab);

    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });

    await waitFor(() => {
      const fixturesTab = screen.getByRole('tab', { name: 'Fixtures & Results' });
      expect(fixturesTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('ArrowRight wraps from League Table back to Fixtures tab', async () => {
    renderApp();

    // Navigate to table tab first
    const tableTab = await screen.findByRole('tab', { name: 'League Table' });
    fireEvent.click(tableTab);

    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });

    await waitFor(() => {
      const fixturesTab = screen.getByRole('tab', { name: 'Fixtures & Results' });
      expect(fixturesTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('ArrowLeft wraps from Fixtures to League Table tab', async () => {
    renderApp();

    const fixturesTab = await screen.findByRole('tab', { name: 'Fixtures & Results' });
    fixturesTab.focus();

    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });

    await waitFor(() => {
      const tableTab = screen.getByRole('tab', { name: 'League Table' });
      expect(tableTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('Home key navigates to first tab (Fixtures)', async () => {
    renderApp();

    // Navigate to table tab first
    const tableTab = await screen.findByRole('tab', { name: 'League Table' });
    fireEvent.click(tableTab);

    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'Home' });

    await waitFor(() => {
      const fixturesTab = screen.getByRole('tab', { name: 'Fixtures & Results' });
      expect(fixturesTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('End key navigates to last tab (League Table)', async () => {
    renderApp();

    await screen.findByRole('tab', { name: 'Fixtures & Results' });

    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'End' });

    await waitFor(() => {
      const tableTab = screen.getByRole('tab', { name: 'League Table' });
      expect(tableTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  it('tabpanel updates correctly when switching tabs via keyboard', async () => {
    renderApp();

    await screen.findByRole('tabpanel');
    const tablist = screen.getByRole('tablist');

    // Start on fixtures panel
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'fixtures-panel');

    fireEvent.keyDown(tablist, { key: 'ArrowRight' });

    await waitFor(() => {
      expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'table-panel');
    });
  });

  it('tab buttons have correct IDs and aria-controls', async () => {
    renderApp();

    const fixturesTab = await screen.findByRole('tab', { name: 'Fixtures & Results' });
    const tableTab = screen.getByRole('tab', { name: 'League Table' });

    expect(fixturesTab).toHaveAttribute('id', 'fixtures-tab');
    expect(fixturesTab).toHaveAttribute('aria-controls', 'fixtures-panel');
    expect(tableTab).toHaveAttribute('id', 'table-tab');
    expect(tableTab).toHaveAttribute('aria-controls', 'table-panel');
  });
});
