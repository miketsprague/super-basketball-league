import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton, SkeletonLeagueTableRow, SkeletonMatchCard, SkeletonDateGroup } from '../Skeleton';

describe('Skeleton', () => {
  it('renders with animate-pulse class', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('applies additional className', () => {
    const { container } = render(<Skeleton className="h-4 w-8" />);
    expect(container.firstChild).toHaveClass('h-4', 'w-8');
  });

  it('is hidden from assistive technology', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('SkeletonLeagueTableRow', () => {
  it('renders a table row', () => {
    const { container } = render(
      <table><tbody><SkeletonLeagueTableRow /></tbody></table>
    );
    expect(container.querySelector('tr')).not.toBeNull();
  });

  it('renders 7 cells', () => {
    const { container } = render(
      <table><tbody><SkeletonLeagueTableRow /></tbody></table>
    );
    expect(container.querySelectorAll('td')).toHaveLength(7);
  });

  it('is hidden from assistive technology', () => {
    const { container } = render(
      <table><tbody><SkeletonLeagueTableRow /></tbody></table>
    );
    expect(container.querySelector('tr')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('SkeletonMatchCard', () => {
  it('renders a card container', () => {
    const { container } = render(<SkeletonMatchCard />);
    expect(container.firstChild).toHaveClass('bg-white', 'rounded-lg');
  });

  it('is hidden from assistive technology', () => {
    const { container } = render(<SkeletonMatchCard />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('SkeletonDateGroup', () => {
  it('renders two skeleton match cards', () => {
    const { container } = render(<SkeletonDateGroup />);
    const cards = container.querySelectorAll('.bg-white.rounded-lg');
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });

  it('renders date header placeholder', () => {
    const { container } = render(<SkeletonDateGroup />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('LeagueTable skeleton loading', () => {
  it('renders skeleton rows while loading', async () => {
    const { LeagueTable } = await import('../LeagueTable');
    // Need router context for useNavigate
    const { MemoryRouter } = await import('react-router-dom');
    const { container } = render(
      <MemoryRouter>
        <LeagueTable standings={[]} loading={true} />
      </MemoryRouter>
    );
    // Should show table structure with skeleton rows, not a spinner
    expect(container.querySelector('table')).not.toBeNull();
    expect(container.querySelector('.animate-spin')).toBeNull();
    expect(container.querySelectorAll('tbody tr').length).toBe(8);
  });
});

describe('Fixtures skeleton loading', () => {
  it('renders skeleton while loading', async () => {
    const { Fixtures } = await import('../Fixtures');
    const { MemoryRouter } = await import('react-router-dom');
    const { container } = render(
      <MemoryRouter>
        <Fixtures matches={[]} loading={true} />
      </MemoryRouter>
    );
    // Should show skeleton content, not a spinner
    expect(container.querySelector('.animate-spin')).toBeNull();
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
  });
});
