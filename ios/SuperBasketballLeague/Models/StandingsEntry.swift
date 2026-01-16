import Foundation

/// Represents a team's position in the league table
struct StandingsEntry: Identifiable, Codable, Hashable {
    let position: Int
    let team: Team
    let played: Int
    let won: Int
    let lost: Int
    let pointsFor: Int
    let pointsAgainst: Int
    let pointsDifference: Int
    let points: Int
    
    var id: String { team.id }
    
    /// Formatted points difference with + sign for positive values
    var formattedPointsDifference: String {
        if pointsDifference > 0 {
            return "+\(pointsDifference)"
        }
        return "\(pointsDifference)"
    }
}
