import { useState, useEffect } from 'react';
import { Fixtures } from './components/Fixtures';
import { LeagueTable } from './components/LeagueTable';
import type { Match, StandingsEntry } from './types';

type Tab = 'fixtures' | 'table';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('fixtures');
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<StandingsEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchData = async () => {
      setLoading(true);
      try {
        // Placeholder - will be replaced with real API
        await new Promise(resolve => setTimeout(resolve, 500));
        setMatches([]);
        setStandings([]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white py-4 px-4 shadow-lg">
        <h1 className="text-xl font-bold text-center">
          🏀 Super Basketball League
        </h1>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white shadow sticky top-0 z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab('fixtures')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'fixtures'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Fixtures & Results
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'table'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            League Table
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-lg mx-auto p-4">
        {activeTab === 'fixtures' ? (
          <Fixtures matches={matches} loading={loading} />
        ) : (
          <LeagueTable standings={standings} loading={loading} />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-4">
        Super Basketball League © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
