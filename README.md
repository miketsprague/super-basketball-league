# 🏀 Basketball Leagues

A mobile-first web application to display fixtures, results, and league standings for multiple basketball leagues including **Super League Basketball** (UK's top basketball league) and **EuroLeague**.

Built with React, TypeScript, Vite, and Tailwind CSS.

## 🌟 Features

- 📱 Mobile-first responsive design
- 🌍 **Multi-league support** - Switch between different basketball leagues
- 🏆 Live league standings with playoff and relegation indicators
- 📅 Fixtures and results with British date formatting
- 🔄 Auto-refresh data every 5 minutes
- ⚡ Fast loading with Vite
- 🎨 Modern UI with Tailwind CSS (FotMob-inspired league selector)
- 📊 API integration with fallback to mock data

## 🏀 Supported Leagues

- **Super League Basketball** - UK's top domestic basketball league (live data from Genius Sports)
- **EuroLeague** - Europe's premier basketball competition (live data from official API)
- **EuroCup** - Europe's second-tier basketball competition (live data from official API)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/miketsprague/super-basketball-league.git
   cd super-basketball-league
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173/super-basketball-league/](http://localhost:5173/super-basketball-league/) in your browser

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Project Structure

```
super-basketball-league/
├── src/
│   ├── components/       # React components
│   │   ├── Fixtures.tsx
│   │   ├── LeagueSelector.tsx  # League switching UI
│   │   ├── LeagueTable.tsx
│   │   └── MatchDetail.tsx
│   ├── services/         # API and data services
│   │   ├── geniusSportsApi.ts  # Genius Sports API (SLB)
│   │   ├── euroleagueApi.ts    # EuroLeague API
│   │   ├── leagues.ts    # League configuration
│   │   ├── mockProvider.ts  # Mock data provider
│   │   └── dataProvider.ts  # Main data abstraction layer
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── docs/                 # Documentation
│   ├── ARCHITECTURE.md   # System architecture
│   ├── GENIUS_SPORTS_API.md  # Genius Sports API docs
│   ├── EUROLEAGUE_API.md # EuroLeague API docs
│   └── adr/              # Architecture Decision Records
├── public/               # Static assets
└── .github/workflows/    # GitHub Actions workflows
```

## 🌐 API Configuration

The app uses multiple free data sources - **no API keys required**:

| League | Data Source | API Key Required |
|--------|-------------|------------------|
| **Super League Basketball** | [Genius Sports](https://www.geniussports.com/) | No |
| **EuroLeague** | [Official EuroLeague API](https://api-live.euroleague.net/) | No |
| **EuroCup** | [Official EuroLeague API](https://api-live.euroleague.net/) | No |

### Mock Data Fallback (Development)

For development and testing, you can enable mock data fallback when the API is unavailable:

```
VITE_USE_MOCK_FALLBACK=true
```

When enabled, the app will automatically use mock data if API requests fail. In production, this should be disabled to show proper error states to users.

## 📦 Deployment

### GitHub Pages

The app is configured for automatic deployment to GitHub Pages via GitHub Actions.

**⚠️ IMPORTANT: GitHub Pages Setup**

1. Go to repository **Settings → Pages**
2. Under "Build and deployment":
   - **Source**: Select **GitHub Actions** (NOT "Deploy from a branch")
3. Push to the `main` branch to trigger deployment

If "Deploy from a branch" is selected, GitHub will try to use Jekyll which cannot build React/Vite apps, resulting in a **blank page**.

The app will be available at: `https://[username].github.io/super-basketball-league/`

### Manual Deployment

```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## 🏀 Super League Teams (2025-26 Season)

1. London Lions
2. Cheshire Phoenix
3. B. Braun Sheffield Sharks
4. Manchester Basketball
5. Bristol Flyers
6. Leicester Riders
7. Surrey 89ers
8. Newcastle Eagles
9. Caledonia Gladiators

## 🇪🇺 EuroLeague Teams (2025-26 Season)

1. Real Madrid
2. FC Barcelona
3. Olympiacos Piraeus
4. Panathinaikos Athens
5. Fenerbahce Istanbul
6. Anadolu Efes
7. Maccabi Tel Aviv
8. CSKA Moscow
9. EA7 Emporio Armani Milano
10. FC Bayern Munich
11. Partizan Belgrade
12. AS Monaco

## 🛠 Technical Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Testing:** Vitest
- **Routing:** React Router Dom 7
- **Linting:** ESLint 9

## 📝 License

This project is open source and available under the MIT License.

## 🔗 Links

- [Super League Basketball Official Site](https://www.superleaguebasketballm.co.uk/)
- [EuroLeague Official Site](https://www.euroleaguebasketball.net/)
- [EuroCup Official Site](https://www.euroleaguebasketball.net/eurocup/)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with ❤️ for basketball fans
