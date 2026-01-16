import SwiftUI

/// Match detail view showing comprehensive match information
struct MatchDetailView: View {
    @StateObject private var viewModel: MatchDetailViewModel
    @Environment(\.dismiss) private var dismiss
    
    init(matchId: String) {
        _viewModel = StateObject(wrappedValue: MatchDetailViewModel(matchId: matchId))
    }
    
    var body: some View {
        Group {
            if viewModel.isLoading && viewModel.matchDetails == nil {
                loadingView
            } else if let errorMessage = viewModel.errorMessage {
                errorView(errorMessage)
            } else if let match = viewModel.matchDetails {
                matchContent(match)
            } else {
                emptyView
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                if viewModel.matchDetails?.status == .live {
                    HStack(spacing: 8) {
                        Text(viewModel.formattedLastUpdated)
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                        
                        Button {
                            Task {
                                await viewModel.refresh()
                            }
                        } label: {
                            Image(systemName: "arrow.clockwise")
                        }
                    }
                } else {
                    Button {
                        Task {
                            await viewModel.refresh()
                        }
                    } label: {
                        Image(systemName: "arrow.clockwise")
                    }
                }
            }
        }
        .task {
            await viewModel.loadMatchDetails()
        }
    }
    
    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .controlSize(.large)
            Text("Loading match details...")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
    }
    
    private func errorView(_ message: String) -> some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle")
                .font(.largeTitle)
                .foregroundStyle(.red)
            
            Text(message)
                .font(.headline)
                .foregroundStyle(.secondary)
            
            Button("Try Again") {
                Task {
                    await viewModel.loadMatchDetails()
                }
            }
            .buttonStyle(.borderedProminent)
            .tint(.orange)
        }
        .padding()
    }
    
    private var emptyView: some View {
        VStack(spacing: 12) {
            Image(systemName: "sportscourt")
                .font(.largeTitle)
                .foregroundStyle(.secondary)
            
            Text("Match not found")
                .font(.headline)
                .foregroundStyle(.secondary)
        }
    }
    
    private func matchContent(_ match: MatchDetails) -> some View {
        ScrollView {
            VStack(spacing: 16) {
                // Score Header
                scoreHeader(match)
                
                // Quarter Scores
                if let quarterScores = match.quarterScores,
                   match.status == .completed || match.status == .live {
                    quarterScoresView(match, quarterScores)
                }
                
                // Team Statistics
                if let homeStats = match.homeStats, let awayStats = match.awayStats {
                    teamStatsView(match, homeStats: homeStats, awayStats: awayStats)
                } else if match.status == .scheduled {
                    scheduledMatchInfoView
                }
                
                // Top Performers
                if let homePlayers = match.homePlayers, let awayPlayers = match.awayPlayers {
                    topPerformersView(match, homePlayers: homePlayers, awayPlayers: awayPlayers)
                }
            }
            .padding(.bottom, 32)
        }
        .background(Color(.systemGroupedBackground))
    }
    
    private func scoreHeader(_ match: MatchDetails) -> some View {
        VStack(spacing: 16) {
            // Status Badge
            DetailStatusBadge(status: match.status, period: match.currentPeriod)
            
            // Teams and Score
            HStack(spacing: 20) {
                // Home Team
                VStack(spacing: 4) {
                    Text(match.homeTeam.shortName)
                        .font(.headline)
                        .fontWeight(.bold)
                    
                    Text(match.homeTeam.name)
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .lineLimit(2)
                        .multilineTextAlignment(.center)
                }
                .frame(maxWidth: .infinity)
                
                // Score
                HStack(spacing: 8) {
                    Text(match.homeScore.map { String($0) } ?? "-")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .monospacedDigit()
                    
                    Text("-")
                        .font(.title)
                        .foregroundStyle(.secondary)
                    
                    Text(match.awayScore.map { String($0) } ?? "-")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .monospacedDigit()
                }
                
                // Away Team
                VStack(spacing: 4) {
                    Text(match.awayTeam.shortName)
                        .font(.headline)
                        .fontWeight(.bold)
                    
                    Text(match.awayTeam.name)
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .lineLimit(2)
                        .multilineTextAlignment(.center)
                }
                .frame(maxWidth: .infinity)
            }
            .padding(.horizontal)
            
            // Date, Time, Venue
            VStack(spacing: 4) {
                Text("\(match.fullFormattedDate) • \(match.time)")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                
                Text(match.venue)
                    .font(.caption)
                    .foregroundStyle(.tertiary)
            }
            .padding(.top, 8)
        }
        .padding()
        .background(Color(.systemBackground))
    }
    
    private func quarterScoresView(_ match: MatchDetails, _ quarterScores: QuarterScores) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Score by Quarter")
                .font(.headline)
                .padding(.horizontal)
            
            VStack(spacing: 0) {
                // Header
                HStack(spacing: 0) {
                    Text("Team")
                        .frame(maxWidth: .infinity, alignment: .leading)
                    
                    Text("Q1")
                        .frame(width: 40, alignment: .center)
                    Text("Q2")
                        .frame(width: 40, alignment: .center)
                    Text("Q3")
                        .frame(width: 40, alignment: .center)
                    Text("Q4")
                        .frame(width: 40, alignment: .center)
                    
                    if quarterScores.ot != nil {
                        Text("OT")
                            .frame(width: 40, alignment: .center)
                    }
                    
                    Text("Total")
                        .frame(width: 50, alignment: .center)
                        .fontWeight(.semibold)
                }
                .font(.caption)
                .foregroundStyle(.secondary)
                .padding(.vertical, 8)
                .padding(.horizontal)
                
                Divider()
                
                // Home Team Row
                HStack(spacing: 0) {
                    Text(match.homeTeam.shortName)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .fontWeight(.medium)
                    
                    Text("\(quarterScores.q1?.home ?? 0)")
                        .frame(width: 40, alignment: .center)
                    Text("\(quarterScores.q2?.home ?? 0)")
                        .frame(width: 40, alignment: .center)
                    Text("\(quarterScores.q3?.home ?? 0)")
                        .frame(width: 40, alignment: .center)
                    Text("\(quarterScores.q4?.home ?? 0)")
                        .frame(width: 40, alignment: .center)
                    
                    if let ot = quarterScores.ot {
                        Text("\(ot.home)")
                            .frame(width: 40, alignment: .center)
                    }
                    
                    Text("\(match.homeScore ?? 0)")
                        .frame(width: 50, alignment: .center)
                        .fontWeight(.bold)
                        .foregroundStyle(.orange)
                }
                .font(.subheadline)
                .padding(.vertical, 10)
                .padding(.horizontal)
                
                Divider()
                
                // Away Team Row
                HStack(spacing: 0) {
                    Text(match.awayTeam.shortName)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .fontWeight(.medium)
                    
                    Text("\(quarterScores.q1?.away ?? 0)")
                        .frame(width: 40, alignment: .center)
                    Text("\(quarterScores.q2?.away ?? 0)")
                        .frame(width: 40, alignment: .center)
                    Text("\(quarterScores.q3?.away ?? 0)")
                        .frame(width: 40, alignment: .center)
                    Text("\(quarterScores.q4?.away ?? 0)")
                        .frame(width: 40, alignment: .center)
                    
                    if let ot = quarterScores.ot {
                        Text("\(ot.away)")
                            .frame(width: 40, alignment: .center)
                    }
                    
                    Text("\(match.awayScore ?? 0)")
                        .frame(width: 50, alignment: .center)
                        .fontWeight(.bold)
                        .foregroundStyle(.orange)
                }
                .font(.subheadline)
                .padding(.vertical, 10)
                .padding(.horizontal)
            }
            .background(Color(.systemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .padding(.horizontal)
        }
    }
    
    private func teamStatsView(_ match: MatchDetails, homeStats: TeamStatistics, awayStats: TeamStatistics) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Team Statistics")
                .font(.headline)
                .padding(.horizontal)
            
            VStack(spacing: 16) {
                StatBar(label: "Field Goal %", homeValue: homeStats.fieldGoalPct, awayValue: awayStats.fieldGoalPct, isPercentage: true)
                StatBar(label: "3-Point %", homeValue: homeStats.threePointPct, awayValue: awayStats.threePointPct, isPercentage: true)
                StatBar(label: "Free Throw %", homeValue: homeStats.freeThrowPct, awayValue: awayStats.freeThrowPct, isPercentage: true)
                StatBar(label: "Rebounds", homeValue: homeStats.rebounds, awayValue: awayStats.rebounds)
                StatBar(label: "Assists", homeValue: homeStats.assists, awayValue: awayStats.assists)
                StatBar(label: "Turnovers", homeValue: homeStats.turnovers, awayValue: awayStats.turnovers)
                StatBar(label: "Steals", homeValue: homeStats.steals, awayValue: awayStats.steals)
                StatBar(label: "Blocks", homeValue: homeStats.blocks, awayValue: awayStats.blocks)
            }
            .padding()
            .background(Color(.systemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .padding(.horizontal)
        }
    }
    
    private var scheduledMatchInfoView: some View {
        VStack(spacing: 8) {
            Image(systemName: "clock")
                .font(.title2)
                .foregroundStyle(.secondary)
            
            Text("Statistics will be available once the match begins")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding()
        .frame(maxWidth: .infinity)
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .padding(.horizontal)
    }
    
    private func topPerformersView(_ match: MatchDetails, homePlayers: [PlayerStatistics], awayPlayers: [PlayerStatistics]) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Top Performers")
                .font(.headline)
                .padding(.horizontal)
            
            HStack(alignment: .top, spacing: 16) {
                // Home Team Players
                VStack(alignment: .leading, spacing: 12) {
                    Text(match.homeTeam.shortName)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .fontWeight(.medium)
                    
                    ForEach(homePlayers.prefix(3)) { player in
                        PlayerStatRow(player: player)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                // Away Team Players
                VStack(alignment: .leading, spacing: 12) {
                    Text(match.awayTeam.shortName)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .fontWeight(.medium)
                    
                    ForEach(awayPlayers.prefix(3)) { player in
                        PlayerStatRow(player: player)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding()
            .background(Color(.systemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .padding(.horizontal)
        }
    }
}

/// Status badge for detail view
struct DetailStatusBadge: View {
    let status: MatchStatus
    let period: LivePeriod?
    
    var body: some View {
        Text(statusText)
            .font(.caption)
            .fontWeight(.medium)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(backgroundColor)
            .foregroundStyle(foregroundColor)
            .clipShape(Capsule())
    }
    
    private var statusText: String {
        switch status {
        case .live:
            return period?.rawValue ?? "LIVE"
        case .completed:
            return period?.rawValue ?? "Full Time"
        case .scheduled:
            return "Upcoming"
        }
    }
    
    private var backgroundColor: Color {
        switch status {
        case .live:
            return .red
        case .completed:
            return .secondary.opacity(0.3)
        case .scheduled:
            return .green
        }
    }
    
    private var foregroundColor: Color {
        switch status {
        case .live:
            return .white
        case .completed:
            return .primary
        case .scheduled:
            return .white
        }
    }
}

/// Stat comparison bar
struct StatBar: View {
    let label: String
    let homeValue: Int
    let awayValue: Int
    var isPercentage: Bool = false
    
    var body: some View {
        VStack(spacing: 4) {
            HStack {
                Text(displayValue(homeValue))
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                Spacer()
                
                Text(label)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                
                Spacer()
                
                Text(displayValue(awayValue))
                    .font(.subheadline)
                    .fontWeight(.medium)
            }
            
            GeometryReader { geometry in
                HStack(spacing: 0) {
                    Rectangle()
                        .fill(Color.orange)
                        .frame(width: geometry.size.width * homePercent)
                    
                    Rectangle()
                        .fill(Color.gray.opacity(0.4))
                        .frame(width: geometry.size.width * (1 - homePercent))
                }
                .clipShape(RoundedRectangle(cornerRadius: 2))
            }
            .frame(height: 6)
        }
    }
    
    private var homePercent: CGFloat {
        let total = homeValue + awayValue
        if total == 0 {
            return 0.5
        }
        return CGFloat(homeValue) / CGFloat(total)
    }
    
    private func displayValue(_ value: Int) -> String {
        isPercentage ? "\(value)%" : "\(value)"
    }
}

/// Player statistics row
struct PlayerStatRow: View {
    let player: PlayerStatistics
    
    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(player.name)
                .font(.subheadline)
                .fontWeight(.medium)
            
            Text("\(player.points) pts • \(player.rebounds) reb • \(player.assists) ast")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }
}

#Preview {
    NavigationStack {
        MatchDetailView(matchId: "1")
    }
}
