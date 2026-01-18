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

- **Super League Basketball** - UK's top domestic basketball league (live data from API-Sports.io)
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

3. (Optional) Configure API key:
   ```bash
   cp .env.example .env
   # Edit .env and add your TheSportsDB API key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173/super-basketball-league/](http://localhost:5173/super-basketball-league/) in your browser

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

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
│   │   ├── api.ts        # API integration
│   │   ├── leagues.ts    # League configuration
│   │   ├── mockData.ts   # Mock data for testing
│   │   ├── mockProvider.ts  # Mock data provider
│   │   └── dataProvider.ts  # Main data abstraction layer
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── .github/workflows/    # GitHub Actions workflows
```

## 🌐 API Configuration

The app uses multiple data sources depending on the league:

### Data Sources by League

| League | Data Source | API Key Required |
|--------|-------------|------------------|
| **Super League Basketball** | [API-Sports.io](https://api-sports.io/documentation/basketball/v1) | Yes |
| **EuroLeague** | [Official EuroLeague API](https://api-live.euroleague.net/swagger/index.html) | No |
| **EuroCup** | [Official EuroLeague API](https://api-live.euroleague.net/swagger/index.html) | No |

### Super League Basketball (API-Sports.io)

The app uses the API-Sports.io Basketball API for Super League Basketball data:
- Game schedules and results
- League standings
- Live scores

**Setting up the API key:**
1. Sign up for a free account at [API-Sports.io](https://api-sports.io/)
2. Copy your API key from the dashboard
3. Add it to your environment:
   ```
   VITE_API_SPORTS_KEY=your_api_key_here
   ```

The free tier includes 100 requests per day, which is sufficient for personal use.

### EuroLeague/EuroCup API

The app uses the official EuroLeague API which provides free access to:
- Game schedules and results
- League standings
- Team information

No API key is required - the API is publicly accessible.

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

### Troubleshooting GitHub Pages Deployment

**Blank White Page?** This is usually caused by one of these issues:

1. **GitHub Pages Source is set to "Deploy from a branch" instead of "GitHub Actions"**
   - Go to repository Settings → Pages
   - Under "Build and deployment", change **Source** to **GitHub Actions**
   - This is the most common cause of blank pages!

2. **Check the workflow status:**
   - Go to the Actions tab
   - Look for the "Deploy to GitHub Pages" workflow (NOT "pages build and deployment")
   - If it shows a failure, check the logs for error details

3. **Verify API key is set:**
   - Go to Settings → Secrets and variables → Actions
   - Ensure `VITE_SPORTSDB_API_KEY` secret exists (optional - app works without it but shows error message)

4. **Trigger a new deployment:**
   - Make a small commit to `main` branch, or
   - Go to Actions → "Deploy to GitHub Pages" → "Run workflow"

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
- **Routing:** React Router Dom 7
- **Linting:** ESLint 9

## 📝 License

This project is open source and available under the MIT License.

## 🔗 Links

- [Super League Basketball Official Site](https://www.superleaguebasketballm.co.uk/)
- [EuroLeague Official Site](https://www.euroleaguebasketball.net/)
- [EuroCup Official Site](https://www.euroleaguebasketball.net/eurocup/)
- [API-Sports.io Documentation](https://api-sports.io/documentation/basketball/v1)
- [EuroLeague API Documentation](https://api-live.euroleague.net/swagger/index.html)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with ❤️ for basketball fans
