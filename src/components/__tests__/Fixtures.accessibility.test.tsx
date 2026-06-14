import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Fixtures } from '../Fixtures';
import type { Match } from '../../types';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...(actual as object),
    useNavigate: () => vi.fn(),
  };
});

function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: 'match-1',
    homeTeam: { id: 'h1', name: 'Leicester Riders', shortName: 'LEI' },
    awayTeam: { id: 'a1', name: 'London Lions', shortName: 'LON' },
    date: '2099-12-01',
    time: '19:30',
    venue: 'Morningside Arena',
    status: 'scheduled',
    ...overrides,
  };
}

function renderFixtures(matches: Match[]) {
  return render(
    <MemoryRouter>
      <Fixtures matches={matches} loading={false} />
    </MemoryRouter>
  );
}

// ─── Filter tab ARIA ──────────────────────────────────────────────────────────

describe('Fixtures — filter tab ARIA roles', () => {
  it('renders a tablist for the filter tabs', () => {
    renderFixtures([makeMatch()]);
    expect(screen.getByRole('tablist', { name: /Filter fixtures/i })).toBeInTheDocument();
  });

  it('renders three filter tabs with role="tab"', () => {
    renderFixtures([makeMatch()]);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
  });

  it('marks the active tab as aria-selected="true"', () => {
    renderFixtures([makeMatch()]);
    const fixturesTab = screen.getByRole('tab', { name: /Fixtures/i });
    expect(fixturesTab).toHaveAttribute('aria-selected', 'true');
  });

  it('marks inactive tabs as aria-selected="false"', () => {
    renderFixtures([makeMatch()]);
    const resultsTab = screen.getByRole('tab', { name: /Results/i });
    const allTab = screen.getByRole('tab', { name: /All/i });
    expect(resultsTab).toHaveAttribute('aria-selected', 'false');
    expect(allTab).toHaveAttribute('aria-selected', 'false');
  });

  it('sets tabIndex=0 on the active tab and -1 on others', () => {
    renderFixtures([makeMatch()]);
    const [fixturesTab, resultsTab, allTab] = screen.getAllByRole('tab');
    expect(fixturesTab).toHaveAttribute('tabindex', '0');
    expect(resultsTab).toHaveAttribute('tabindex', '-1');
    expect(allTab).toHaveAttribute('tabindex', '-1');
  });

  it('links each tab to its panel via aria-controls', () => {
    renderFixtures([makeMatch()]);
    const fixturesTab = screen.getByRole('tab', { name: /Fixtures/i });
    const panelId = fixturesTab.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId!)).toBeInTheDocument();
  });

  it('renders the active panel with role="tabpanel"', () => {
    renderFixtures([makeMatch()]);
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('labels the tabpanel with aria-labelledby pointing to the active tab', () => {
    renderFixtures([makeMatch()]);
    const panel = screen.getByRole('tabpanel');
    const labelledBy = panel.getAttribute('aria-labelledby');
    const fixturesTab = screen.getByRole('tab', { name: /Fixtures/i });
    expect(labelledBy).toBe(fixturesTab.getAttribute('id'));
  });
});

// ─── Match card ARIA labels ───────────────────────────────────────────────────

describe('Fixtures — match card aria-label', () => {
  it('adds an aria-label to each match card button', () => {
    renderFixtures([makeMatch()]);
    const cards = screen.getAllByRole('button', { name: /Leicester Riders vs London Lions/i });
    expect(cards.length).toBeGreaterThan(0);
  });

  it('includes "Full time" and score in the aria-label for completed matches', () => {
    render(
      <MemoryRouter initialEntries={['/?tab=results']}>
        <Fixtures
          matches={[
            makeMatch({
              date: '2025-01-10',
              status: 'completed',
              homeScore: 84,
              awayScore: 90,
            }),
          ]}
          loading={false}
        />
      </MemoryRouter>
    );
    const card = screen.getByRole('button', { name: /Full time/i });
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('84'));
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('90'));
  });

  it('includes "LIVE" in the aria-label for live matches', () => {
    const today = new Date().toISOString().split('T')[0];
    renderFixtures([
      makeMatch({ date: today, status: 'live', homeScore: 55, awayScore: 48 }),
    ]);
    const card = screen.getByRole('button', { name: /LIVE/i });
    expect(card).toBeInTheDocument();
  });

  it('includes venue in the aria-label for upcoming matches', () => {
    renderFixtures([makeMatch()]);
    const card = screen.getByRole('button', { name: /Morningside Arena/i });
    expect(card).toBeInTheDocument();
  });

  it('includes "View match details" in every match card aria-label', () => {
    const futureMatch1 = makeMatch({ id: 'match-1' });
    const futureMatch2 = makeMatch({ id: 'match-2', date: '2099-12-02' });
    render(
      <MemoryRouter>
        <Fixtures matches={[futureMatch1, futureMatch2]} loading={false} />
      </MemoryRouter>
    );
    const cards = screen.getAllByRole('button', { name: /View match details/i });
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });
});

// ─── Loading and empty states ─────────────────────────────────────────────────

describe('Fixtures — empty state', () => {
  it('renders a loading spinner when loading=true', () => {
    render(
      <MemoryRouter>
        <Fixtures matches={[]} loading={true} />
      </MemoryRouter>
    );
    // Spinner uses animate-spin class; no matches should be present
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
  });

  it('shows "No fixtures available" message when matches array is empty', () => {
    renderFixtures([]);
    expect(screen.getByText(/No fixtures available/i)).toBeInTheDocument();
  });
});
