import Foundation

/// Quarter scores for home and away teams
struct QuarterScore: Codable, Hashable {
    let home: Int
    let away: Int
}

/// All quarter scores for a match
struct QuarterScores: Codable, Hashable {
    var q1: QuarterScore?
    var q2: QuarterScore?
    var q3: QuarterScore?
    var q4: QuarterScore?
    var ot: QuarterScore?
}

/// Team statistics for a match
struct TeamStatistics: Codable, Hashable {
    let fieldGoalPct: Int
    let threePointPct: Int
    let freeThrowPct: Int
    let rebounds: Int
    let offensiveRebounds: Int
    let defensiveRebounds: Int
    let assists: Int
    let turnovers: Int
    let steals: Int
    let blocks: Int
}

/// Player statistics in a match
struct PlayerStatistics: Identifiable, Codable, Hashable {
    let id: String
    let name: String
    let points: Int
    let rebounds: Int
    let assists: Int
    let minutes: Int
}

/// Extended match information with detailed statistics
struct MatchDetails: Identifiable, Codable, Hashable {
    let id: String
    let homeTeam: Team
    let awayTeam: Team
    var homeScore: Int?
    var awayScore: Int?
    let date: String
    let time: String
    let venue: String
    let status: MatchStatus
    var currentPeriod: LivePeriod?
    var quarterScores: QuarterScores?
    var homeStats: TeamStatistics?
    var awayStats: TeamStatistics?
    var homePlayers: [PlayerStatistics]?
    var awayPlayers: [PlayerStatistics]?
    var lastUpdated: String?
    
    /// Formats the date for display
    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        guard let date = formatter.date(from: self.date) else {
            return self.date
        }
        
        let displayFormatter = DateFormatter()
        displayFormatter.dateFormat = "EEE d MMM"
        displayFormatter.locale = Locale(identifier: "en_GB")
        return displayFormatter.string(from: date)
    }
    
    /// Full formatted date for detail view
    var fullFormattedDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        guard let date = formatter.date(from: self.date) else {
            return self.date
        }
        
        let displayFormatter = DateFormatter()
        displayFormatter.dateFormat = "EEEE, d MMMM yyyy"
        displayFormatter.locale = Locale(identifier: "en_GB")
        return displayFormatter.string(from: date)
    }
    
    /// Get display text for match status
    var statusDisplay: String {
        switch status {
        case .live:
            return currentPeriod?.rawValue ?? "LIVE"
        case .completed:
            return currentPeriod?.rawValue ?? "Full Time"
        case .scheduled:
            return "Upcoming"
        }
    }
}
