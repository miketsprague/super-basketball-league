import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Fixtures } from '../Fixtures';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const noMatches: never[] = [];

describe('Fixtures lastRefreshed prop', () => {
  it('does not render timestamp when lastRefreshed is not provided', () => {
    render(
      <MemoryRouter>
        <Fixtures matches={noMatches} loading={false} />
      </MemoryRouter>,
    );
    expect(screen.queryByText(/Updated/)).toBeNull();
  });

  it('does not render timestamp when lastRefreshed is null', () => {
    render(
      <MemoryRouter>
        <Fixtures matches={noMatches} loading={false} lastRefreshed={null} />
      </MemoryRouter>,
    );
    expect(screen.queryByText(/Updated/)).toBeNull();
  });

  it('renders "Updated HH:MM" when lastRefreshed is provided', () => {
    const fixedDate = new Date('2026-05-13T14:32:00');
    render(
      <MemoryRouter>
        <Fixtures matches={noMatches} loading={false} lastRefreshed={fixedDate} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Updated/)).toBeInTheDocument();
  });

  it('timestamp element has aria-live="polite" for accessibility', () => {
    const fixedDate = new Date('2026-05-13T14:32:00');
    render(
      <MemoryRouter>
        <Fixtures matches={noMatches} loading={false} lastRefreshed={fixedDate} />
      </MemoryRouter>,
    );
    const el = screen.getByText(/Updated/);
    expect(el).toHaveAttribute('aria-live', 'polite');
  });
});
