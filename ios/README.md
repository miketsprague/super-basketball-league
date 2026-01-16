# 🏀 Super Basketball League - iOS App

A native Swift iOS app to display fixtures, results, and league standings for **Super League Basketball** (UK's top basketball league).

Built with SwiftUI and follows Apple Human Interface Guidelines.

## 🌟 Features

- 📱 Native iOS design with SwiftUI
- 🏆 Live league standings with playoff and relegation indicators
- 📅 Fixtures and results with British date formatting
- 📊 Detailed match statistics with quarter-by-quarter scores
- 👤 Top performer statistics for each match
- 🔄 Auto-refresh data every 5 minutes (30 seconds for live matches)
- ⚡ Async/await for responsive UI
- 🎨 Modern UI following Apple Human Interface Guidelines
- 📊 API integration with TheSportsDB with fallback to mock data

## 📱 Screenshots

The app includes:
- **Fixtures & Results tab**: Browse upcoming fixtures and recent results
- **League Table tab**: View current standings with playoff/relegation indicators
- **Match Detail view**: Comprehensive match information including:
  - Score by quarter
  - Team statistics comparison
  - Top performers from each team

## 🛠 Requirements

- iOS 17.0+
- Xcode 15.0+
- Swift 5.9+

## 🚀 Quick Start

### Open in Xcode

1. Open `ios/SuperBasketballLeague.xcodeproj` in Xcode
2. Select your target device or simulator
3. Press `Cmd + R` to build and run

### Project Structure

```
ios/
├── SuperBasketballLeague.xcodeproj
└── SuperBasketballLeague/
    ├── SuperBasketballLeagueApp.swift  # App entry point
    ├── Models/                          # Data models
    │   ├── Team.swift
    │   ├── Match.swift
    │   ├── MatchDetails.swift
    │   └── StandingsEntry.swift
    ├── Views/                           # SwiftUI views
    │   ├── HomeView.swift               # Main tab view
    │   ├── FixturesView.swift           # Fixtures list
    │   ├── LeagueTableView.swift        # League table
    │   └── MatchDetailView.swift        # Match details
    ├── ViewModels/                      # View models
    │   ├── HomeViewModel.swift
    │   └── MatchDetailViewModel.swift
    ├── Services/                        # API and data services
    │   ├── APIService.swift             # TheSportsDB API integration
    │   └── MockData.swift               # Fallback mock data
    └── Assets.xcassets/                 # App assets
```

## 🌐 API Configuration

The app uses [TheSportsDB API](https://www.thesportsdb.com/) to fetch live data.

The default API key is included for development. For production:

1. Sign up for an API key at [TheSportsDB](https://www.thesportsdb.com/)
2. Update the `apiKey` constant in `Services/APIService.swift`

**Note:** If the API is unavailable or returns no data, the app automatically falls back to mock data.

## 🏀 Teams (2025-26 Season)

1. London Lions
2. Cheshire Phoenix
3. B. Braun Sheffield Sharks
4. Manchester Basketball
5. Bristol Flyers
6. Leicester Riders
7. Surrey 89ers
8. Newcastle Eagles
9. Caledonia Gladiators

## 🛠 Technical Stack

- **Framework:** SwiftUI
- **Language:** Swift 5.9
- **Minimum iOS:** 17.0
- **Architecture:** MVVM (Model-View-ViewModel)
- **Concurrency:** Swift Concurrency (async/await)
- **Networking:** URLSession with Codable

## 📝 Apple Human Interface Guidelines Compliance

This app follows Apple's HIG recommendations:

- **Navigation:** Standard NavigationStack with proper back navigation
- **Tab Bar:** Custom segmented control for switching between fixtures and standings
- **Lists:** Native iOS list styling with proper spacing and touch targets
- **Typography:** System fonts with proper hierarchy
- **Colors:** Orange accent color with semantic system colors
- **Feedback:** Loading indicators, pull-to-refresh, error states
- **Accessibility:** Proper font scaling and color contrast

## 📄 License

This project is open source and available under the MIT License.

---

Made with ❤️ for basketball fans
