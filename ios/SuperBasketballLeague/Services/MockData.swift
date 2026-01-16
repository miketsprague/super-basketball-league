import Foundation

/// Mock data provider for the Super Basketball League app
/// Used as fallback when API is unavailable
enum MockData {
    // MARK: - Teams
    
    static let teams: [String: Team] = [
        "londonLions": Team(id: "1", name: "London Lions", shortName: "Lions"),
        "cheshirePhoenix": Team(id: "2", name: "Cheshire Phoenix", shortName: "Phoenix"),
        "sheffieldSharks": Team(id: "3", name: "B. Braun Sheffield Sharks", shortName: "Sharks"),
        "manchesterBasketball": Team(id: "4", name: "Manchester Basketball", shortName: "Manchester"),
        "bristolFlyers": Team(id: "5", name: "Bristol Flyers", shortName: "Flyers"),
        "leicesterRiders": Team(id: "6", name: "Leicester Riders", shortName: "Riders"),
        "surrey89ers": Team(id: "7", name: "Surrey 89ers", shortName: "Surrey"),
        "newcastleEagles": Team(id: "8", name: "Newcastle Eagles", shortName: "Eagles"),
        "caledoniaGladiators": Team(id: "9", name: "Caledonia Gladiators", shortName: "Gladiators")
    ]
    
    // MARK: - Matches
    
    static let matches: [Match] = [
        // Recent results
        Match(
            id: "1",
            homeTeam: teams["londonLions"]!,
            awayTeam: teams["leicesterRiders"]!,
            homeScore: 87,
            awayScore: 92,
            date: "2026-01-12",
            time: "19:30",
            venue: "Copper Box Arena",
            status: .completed
        ),
        Match(
            id: "2",
            homeTeam: teams["cheshirePhoenix"]!,
            awayTeam: teams["manchesterBasketball"]!,
            homeScore: 78,
            awayScore: 85,
            date: "2026-01-13",
            time: "19:00",
            venue: "Cheshire Oaks Arena",
            status: .completed
        ),
        Match(
            id: "3",
            homeTeam: teams["sheffieldSharks"]!,
            awayTeam: teams["bristolFlyers"]!,
            homeScore: 91,
            awayScore: 88,
            date: "2026-01-14",
            time: "18:00",
            venue: "Ponds Forge",
            status: .completed
        ),
        Match(
            id: "4",
            homeTeam: teams["newcastleEagles"]!,
            awayTeam: teams["caledoniaGladiators"]!,
            homeScore: 95,
            awayScore: 89,
            date: "2026-01-15",
            time: "19:30",
            venue: "Eagles Community Arena",
            status: .completed
        ),
        // Upcoming fixtures
        Match(
            id: "5",
            homeTeam: teams["leicesterRiders"]!,
            awayTeam: teams["cheshirePhoenix"]!,
            homeScore: nil,
            awayScore: nil,
            date: "2026-01-18",
            time: "19:30",
            venue: "Mattioli Arena",
            status: .scheduled
        ),
        Match(
            id: "6",
            homeTeam: teams["manchesterBasketball"]!,
            awayTeam: teams["londonLions"]!,
            homeScore: nil,
            awayScore: nil,
            date: "2026-01-19",
            time: "18:00",
            venue: "National Basketball Performance Centre",
            status: .scheduled
        ),
        Match(
            id: "7",
            homeTeam: teams["bristolFlyers"]!,
            awayTeam: teams["surrey89ers"]!,
            homeScore: nil,
            awayScore: nil,
            date: "2026-01-19",
            time: "19:00",
            venue: "SGS WISE Arena",
            status: .scheduled
        ),
        Match(
            id: "8",
            homeTeam: teams["caledoniaGladiators"]!,
            awayTeam: teams["sheffieldSharks"]!,
            homeScore: nil,
            awayScore: nil,
            date: "2026-01-20",
            time: "17:30",
            venue: "Emirates Arena",
            status: .scheduled
        ),
        Match(
            id: "9",
            homeTeam: teams["surrey89ers"]!,
            awayTeam: teams["newcastleEagles"]!,
            homeScore: nil,
            awayScore: nil,
            date: "2026-01-21",
            time: "19:30",
            venue: "Surrey Sports Park",
            status: .scheduled
        ),
        Match(
            id: "10",
            homeTeam: teams["londonLions"]!,
            awayTeam: teams["bristolFlyers"]!,
            homeScore: nil,
            awayScore: nil,
            date: "2026-01-25",
            time: "19:30",
            venue: "Copper Box Arena",
            status: .scheduled
        )
    ]
    
    // MARK: - Standings
    
    static let standings: [StandingsEntry] = [
        StandingsEntry(
            position: 1,
            team: teams["leicesterRiders"]!,
            played: 18, won: 15, lost: 3,
            pointsFor: 1580, pointsAgainst: 1445, pointsDifference: 135,
            points: 30
        ),
        StandingsEntry(
            position: 2,
            team: teams["londonLions"]!,
            played: 18, won: 14, lost: 4,
            pointsFor: 1625, pointsAgainst: 1510, pointsDifference: 115,
            points: 28
        ),
        StandingsEntry(
            position: 3,
            team: teams["manchesterBasketball"]!,
            played: 18, won: 12, lost: 6,
            pointsFor: 1545, pointsAgainst: 1480, pointsDifference: 65,
            points: 24
        ),
        StandingsEntry(
            position: 4,
            team: teams["sheffieldSharks"]!,
            played: 18, won: 11, lost: 7,
            pointsFor: 1520, pointsAgainst: 1495, pointsDifference: 25,
            points: 22
        ),
        StandingsEntry(
            position: 5,
            team: teams["cheshirePhoenix"]!,
            played: 18, won: 10, lost: 8,
            pointsFor: 1490, pointsAgainst: 1480, pointsDifference: 10,
            points: 20
        ),
        StandingsEntry(
            position: 6,
            team: teams["newcastleEagles"]!,
            played: 18, won: 9, lost: 9,
            pointsFor: 1465, pointsAgainst: 1470, pointsDifference: -5,
            points: 18
        ),
        StandingsEntry(
            position: 7,
            team: teams["bristolFlyers"]!,
            played: 18, won: 6, lost: 12,
            pointsFor: 1410, pointsAgainst: 1520, pointsDifference: -110,
            points: 12
        ),
        StandingsEntry(
            position: 8,
            team: teams["surrey89ers"]!,
            played: 18, won: 4, lost: 14,
            pointsFor: 1380, pointsAgainst: 1545, pointsDifference: -165,
            points: 8
        ),
        StandingsEntry(
            position: 9,
            team: teams["caledoniaGladiators"]!,
            played: 18, won: 3, lost: 15,
            pointsFor: 1355, pointsAgainst: 1605, pointsDifference: -250,
            points: 6
        )
    ]
    
    // MARK: - Match Details
    
    /// Generate mock statistics for a team
    static func generateMockStats() -> TeamStatistics {
        TeamStatistics(
            fieldGoalPct: Int.random(in: 35...55),
            threePointPct: Int.random(in: 25...45),
            freeThrowPct: Int.random(in: 65...90),
            rebounds: Int.random(in: 30...50),
            offensiveRebounds: Int.random(in: 5...15),
            defensiveRebounds: Int.random(in: 20...35),
            assists: Int.random(in: 15...30),
            turnovers: Int.random(in: 8...18),
            steals: Int.random(in: 4...12),
            blocks: Int.random(in: 2...8)
        )
    }
    
    /// Generate mock player statistics
    static func generateMockPlayers(teamShortName: String, totalScore: Int) -> [PlayerStatistics] {
        let playerNames = [
            "\(teamShortName.prefix(1)). Johnson",
            "\(teamShortName.prefix(1)). Williams",
            "\(teamShortName.prefix(1)). Davis",
            "\(teamShortName.prefix(1)). Miller",
            "\(teamShortName.prefix(1)). Anderson"
        ]
        
        var remainingPoints = totalScore
        var players: [PlayerStatistics] = []
        
        for (index, name) in playerNames.enumerated() {
            let points: Int
            if index == playerNames.count - 1 {
                points = max(0, remainingPoints)
            } else {
                let allocated = Int(Double(remainingPoints) * Double.random(in: 0.2...0.35))
                points = max(0, min(allocated, remainingPoints))
            }
            remainingPoints = max(0, remainingPoints - points)
            
            players.append(PlayerStatistics(
                id: "player-\(index + 1)",
                name: name,
                points: max(0, points),
                rebounds: Int.random(in: 2...12),
                assists: Int.random(in: 1...9),
                minutes: Int.random(in: 15...40)
            ))
        }
        
        return players.sorted { $0.points > $1.points }
    }
    
    /// Generate quarter scores that sum to the total
    private static func generateQuarterScores(total: Int) -> (q1: Int, q2: Int, q3: Int, q4: Int) {
        guard total > 0 else {
            return (0, 0, 0, 0)
        }
        
        let q1 = Int(Double(total) * Double.random(in: 0.20...0.25))
        let q2 = Int(Double(total) * Double.random(in: 0.20...0.25))
        let q3 = Int(Double(total) * Double.random(in: 0.20...0.25))
        let q4 = max(0, total - q1 - q2 - q3)
        
        return (q1, q2, q3, q4)
    }
    
    /// Get mock match details for a given match ID
    static func getMatchDetails(matchId: String) -> MatchDetails? {
        guard let match = matches.first(where: { $0.id == matchId }) else {
            return nil
        }
        
        let isCompleted = match.status == .completed
        let isLive = match.status == .live
        
        if !isCompleted && !isLive {
            // Scheduled match - no stats available
            return MatchDetails(
                id: match.id,
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                homeScore: match.homeScore,
                awayScore: match.awayScore,
                date: match.date,
                time: match.time,
                venue: match.venue,
                status: match.status,
                currentPeriod: nil,
                quarterScores: nil,
                homeStats: nil,
                awayStats: nil,
                homePlayers: nil,
                awayPlayers: nil,
                lastUpdated: ISO8601DateFormatter().string(from: Date())
            )
        }
        
        let homeTotal = match.homeScore ?? 0
        let awayTotal = match.awayScore ?? 0
        
        let homeQuarters = generateQuarterScores(total: homeTotal)
        let awayQuarters = generateQuarterScores(total: awayTotal)
        
        return MatchDetails(
            id: match.id,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            homeScore: match.homeScore,
            awayScore: match.awayScore,
            date: match.date,
            time: match.time,
            venue: match.venue,
            status: match.status,
            currentPeriod: isCompleted ? .fullTime : .q3,
            quarterScores: QuarterScores(
                q1: QuarterScore(home: homeQuarters.q1, away: awayQuarters.q1),
                q2: QuarterScore(home: homeQuarters.q2, away: awayQuarters.q2),
                q3: QuarterScore(home: homeQuarters.q3, away: awayQuarters.q3),
                q4: QuarterScore(home: homeQuarters.q4, away: awayQuarters.q4),
                ot: nil
            ),
            homeStats: generateMockStats(),
            awayStats: generateMockStats(),
            homePlayers: generateMockPlayers(teamShortName: match.homeTeam.shortName, totalScore: homeTotal),
            awayPlayers: generateMockPlayers(teamShortName: match.awayTeam.shortName, totalScore: awayTotal),
            lastUpdated: ISO8601DateFormatter().string(from: Date())
        )
    }
}
