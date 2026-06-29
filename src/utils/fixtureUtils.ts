import type { Match } from '../types';

export type FilterTab = 'fixtures' | 'results' | 'all';

/**
 * Filter matches for a given tab relative to a reference date (YYYY-MM-DD).
 *
 * - 'fixtures': upcoming matches from today onwards, plus any live matches
 * - 'results': completed matches from today and earlier (today's results included)
 * - 'all': all matches
 */
export function filterMatchesByTab(
  matches: Match[],
  tab: FilterTab,
  today: string,
): Match[] {
  switch (tab) {
    case 'fixtures':
      return matches
        .filter(m => m.date >= today || m.status === 'live')
        .slice(0, 30);
    case 'results':
      // Include today's completed matches — they are results too
      return matches
        .filter(m => m.date <= today && m.status === 'completed')
        .reverse()
        .slice(0, 30);
    case 'all':
      return matches;
    default:
      return matches;
  }
}
