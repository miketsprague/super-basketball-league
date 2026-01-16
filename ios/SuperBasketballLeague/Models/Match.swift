import Foundation

/// Match status types
enum MatchStatus: String, Codable {
    case scheduled
    case live
    case completed
}

/// Live period types
enum LivePeriod: String, Codable {
    case q1 = "Q1"
    case q2 = "Q2"
    case halfTime = "Half-time"
    case q3 = "Q3"
    case q4 = "Q4"
    case overtime = "OT"
    case fullTime = "Full Time"
}

/// Represents a basketball match
struct Match: Identifiable, Codable, Hashable {
    let id: String
    let homeTeam: Team
    let awayTeam: Team
    var homeScore: Int?
    var awayScore: Int?
    let date: String
    let time: String
    let venue: String
    let status: MatchStatus
    
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
}
