import Foundation

/// API response structures from TheSportsDB
struct SportsDBEvent: Codable {
    let idEvent: String
    let idHomeTeam: String
    let idAwayTeam: String
    let strHomeTeam: String
    let strAwayTeam: String
    let intHomeScore: String?
    let intAwayScore: String?
    let dateEvent: String
    let strTime: String?
    let strVenue: String?
}

struct SportsDBTableEntry: Codable {
    let teamid: String?
    let idTeam: String?
    let name: String?
    let strTeam: String?
    let played: String?
    let intPlayed: String?
    let win: String?
    let intWin: String?
    let loss: String?
    let intLoss: String?
    let goalsfor: String?
    let intGoalsFor: String?
    let goalsagainst: String?
    let intGoalsAgainst: String?
    let total: String?
    let intPoints: String?
}

struct EventsResponse: Codable {
    let events: [SportsDBEvent]?
}

struct TableResponse: Codable {
    let table: [SportsDBTableEntry]?
}

/// Errors that can occur during API requests
enum APIError: Error, LocalizedError {
    case invalidURL
    case networkError(Error)
    case decodingError(Error)
    case noData
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        case .decodingError(let error):
            return "Decoding error: \(error.localizedDescription)"
        case .noData:
            return "No data available"
        }
    }
}

/// Service for fetching data from TheSportsDB API
actor APIService {
    static let shared = APIService()
    
    private let baseURL = "https://www.thesportsdb.com/api/v1/json"
    private let apiKey = "38dde0dae877d7b97cccc6ac32faacef"
    private let leagueId = "4431" // Super League Basketball
    private let currentSeason = "2025-2026"
    
    private init() {}
    
    // MARK: - Public Methods
    
    /// Fetch all matches (upcoming and recent)
    func fetchMatches() async -> [Match] {
        do {
            async let nextMatches = fetchNextMatches()
            async let pastMatches = fetchPastMatches()
            
            let (next, past) = await (nextMatches, pastMatches)
            var allMatches = next + past
            
            if allMatches.isEmpty {
                print("Using mock data for fixtures")
                return MockData.matches
            }
            
            // Sort by date (most recent first)
            allMatches.sort { match1, match2 in
                let formatter = DateFormatter()
                formatter.dateFormat = "yyyy-MM-dd"
                let date1 = formatter.date(from: match1.date) ?? Date.distantPast
                let date2 = formatter.date(from: match2.date) ?? Date.distantPast
                return date1 > date2
            }
            
            return allMatches
        }
    }
    
    /// Fetch league standings
    func fetchStandings() async -> [StandingsEntry] {
        do {
            let url = "\(baseURL)/\(apiKey)/lookuptable.php?l=\(leagueId)&s=\(currentSeason)"
            let data: TableResponse = try await fetchData(from: url)
            
            guard let table = data.table, !table.isEmpty else {
                print("Using mock data for standings")
                return MockData.standings
            }
            
            var standings = table.enumerated().map { index, entry in
                transformTableEntry(entry, index: index)
            }
            
            standings.sort { $0.points > $1.points }
            return standings
        } catch {
            print("Error fetching standings: \(error)")
            return MockData.standings
        }
    }
    
    /// Fetch all data (matches and standings)
    func fetchAllData() async -> (matches: [Match], standings: [StandingsEntry]) {
        async let matches = fetchMatches()
        async let standings = fetchStandings()
        return await (matches, standings)
    }
    
    /// Fetch details for a specific match
    func fetchMatchDetails(matchId: String) async -> MatchDetails? {
        do {
            let url = "\(baseURL)/\(apiKey)/lookupevent.php?id=\(matchId)"
            let data: EventsResponse = try await fetchData(from: url)
            
            if let event = data.events?.first {
                let baseMatch = transformEvent(event)
                
                // TheSportsDB free tier doesn't have detailed stats
                // so we supplement with mock data
                if let mockDetails = MockData.getMatchDetails(matchId: matchId) {
                    return MatchDetails(
                        id: baseMatch.id,
                        homeTeam: baseMatch.homeTeam,
                        awayTeam: baseMatch.awayTeam,
                        homeScore: baseMatch.homeScore,
                        awayScore: baseMatch.awayScore,
                        date: baseMatch.date,
                        time: baseMatch.time,
                        venue: baseMatch.venue,
                        status: baseMatch.status,
                        currentPeriod: mockDetails.currentPeriod,
                        quarterScores: mockDetails.quarterScores,
                        homeStats: mockDetails.homeStats,
                        awayStats: mockDetails.awayStats,
                        homePlayers: mockDetails.homePlayers,
                        awayPlayers: mockDetails.awayPlayers,
                        lastUpdated: ISO8601DateFormatter().string(from: Date())
                    )
                }
                
                return MatchDetails(
                    id: baseMatch.id,
                    homeTeam: baseMatch.homeTeam,
                    awayTeam: baseMatch.awayTeam,
                    homeScore: baseMatch.homeScore,
                    awayScore: baseMatch.awayScore,
                    date: baseMatch.date,
                    time: baseMatch.time,
                    venue: baseMatch.venue,
                    status: baseMatch.status,
                    currentPeriod: nil,
                    quarterScores: nil,
                    homeStats: nil,
                    awayStats: nil,
                    homePlayers: nil,
                    awayPlayers: nil,
                    lastUpdated: ISO8601DateFormatter().string(from: Date())
                )
            }
            
            return MockData.getMatchDetails(matchId: matchId)
        } catch {
            print("Error fetching match details: \(error)")
            return MockData.getMatchDetails(matchId: matchId)
        }
    }
    
    // MARK: - Private Methods
    
    private func fetchNextMatches() async -> [Match] {
        do {
            let url = "\(baseURL)/\(apiKey)/eventsnextleague.php?id=\(leagueId)"
            let data: EventsResponse = try await fetchData(from: url)
            
            guard let events = data.events else { return [] }
            return Array(events.prefix(10).map { transformEvent($0) })
        } catch {
            print("Error fetching next matches: \(error)")
            return []
        }
    }
    
    private func fetchPastMatches() async -> [Match] {
        do {
            let url = "\(baseURL)/\(apiKey)/eventspastleague.php?id=\(leagueId)"
            let data: EventsResponse = try await fetchData(from: url)
            
            guard let events = data.events else { return [] }
            return Array(events.prefix(10).map { transformEvent($0) })
        } catch {
            print("Error fetching past matches: \(error)")
            return []
        }
    }
    
    private func fetchData<T: Codable>(from urlString: String) async throws -> T {
        guard let url = URL(string: urlString) else {
            throw APIError.invalidURL
        }
        
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            let decoded = try JSONDecoder().decode(T.self, from: data)
            return decoded
        } catch let error as DecodingError {
            throw APIError.decodingError(error)
        } catch {
            throw APIError.networkError(error)
        }
    }
    
    private func transformEvent(_ event: SportsDBEvent) -> Match {
        let hasScore = event.intHomeScore != nil && event.intAwayScore != nil
        let eventDate = Date.from(string: event.dateEvent)
        let isPast = eventDate < Date()
        
        let status: MatchStatus
        if hasScore {
            status = .completed
        } else if isPast {
            status = .completed
        } else {
            status = .scheduled
        }
        
        return Match(
            id: event.idEvent,
            homeTeam: Team(
                id: event.idHomeTeam,
                name: event.strHomeTeam,
                shortName: cleanTeamName(event.strHomeTeam)
            ),
            awayTeam: Team(
                id: event.idAwayTeam,
                name: event.strAwayTeam,
                shortName: cleanTeamName(event.strAwayTeam)
            ),
            homeScore: event.intHomeScore.flatMap { Int($0) },
            awayScore: event.intAwayScore.flatMap { Int($0) },
            date: event.dateEvent,
            time: event.strTime ?? "19:00",
            venue: event.strVenue ?? "TBC",
            status: status
        )
    }
    
    private func transformTableEntry(_ entry: SportsDBTableEntry, index: Int) -> StandingsEntry {
        let played = Int(entry.played ?? entry.intPlayed ?? "0") ?? 0
        let won = Int(entry.win ?? entry.intWin ?? "0") ?? 0
        let lost = Int(entry.loss ?? entry.intLoss ?? "0") ?? 0
        let pointsFor = Int(entry.goalsfor ?? entry.intGoalsFor ?? "0") ?? 0
        let pointsAgainst = Int(entry.goalsagainst ?? entry.intGoalsAgainst ?? "0") ?? 0
        let teamName = entry.name ?? entry.strTeam ?? ""
        
        return StandingsEntry(
            position: index + 1,
            team: Team(
                id: entry.teamid ?? entry.idTeam ?? "",
                name: teamName,
                shortName: cleanTeamName(teamName)
            ),
            played: played,
            won: won,
            lost: lost,
            pointsFor: pointsFor,
            pointsAgainst: pointsAgainst,
            pointsDifference: pointsFor - pointsAgainst,
            points: Int(entry.total ?? entry.intPoints ?? "0") ?? 0
        )
    }
    
    private func cleanTeamName(_ name: String) -> String {
        let patterns = ["Basketball", "FC", "AFC", "United"]
        var cleanedName = name
        for pattern in patterns {
            cleanedName = cleanedName.replacingOccurrences(
                of: "\\b\(pattern)\\b",
                with: "",
                options: [.regularExpression, .caseInsensitive]
            )
        }
        return cleanedName.trimmingCharacters(in: .whitespaces)
    }
}

// MARK: - Date Extension

extension Date {
    static func from(string: String, format: String = "yyyy-MM-dd") -> Date {
        let formatter = DateFormatter()
        formatter.dateFormat = format
        return formatter.date(from: string) ?? Date.distantPast
    }
}
