import SwiftUI

/// Individual match card view
struct MatchCardView: View {
    let match: Match
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Date, Time and Status
            HStack {
                Text("\(match.formattedDate) • \(match.time)")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                
                Spacer()
                
                StatusBadge(status: match.status)
            }
            
            // Teams and Scores
            VStack(spacing: 8) {
                HStack {
                    Text(match.homeTeam.shortName)
                        .font(.body)
                        .fontWeight(.medium)
                    
                    Spacer()
                    
                    Text(match.homeScore.map { String($0) } ?? "-")
                        .font(.title2)
                        .fontWeight(.bold)
                        .monospacedDigit()
                }
                
                HStack {
                    Text(match.awayTeam.shortName)
                        .font(.body)
                        .fontWeight(.medium)
                    
                    Spacer()
                    
                    Text(match.awayScore.map { String($0) } ?? "-")
                        .font(.title2)
                        .fontWeight(.bold)
                        .monospacedDigit()
                }
            }
            
            // Venue and Details link
            HStack {
                Text(match.venue)
                    .font(.caption)
                    .foregroundStyle(.tertiary)
                    .lineLimit(1)
                
                Spacer()
                
                Text("View details")
                    .font(.caption)
                    .foregroundStyle(.orange)
                
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundStyle(.orange)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.orange, lineWidth: 3)
                .padding(.leading, -1.5)
                .mask(
                    Rectangle()
                        .padding(.trailing, 500)
                )
        )
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

/// Status badge for match status
struct StatusBadge: View {
    let status: MatchStatus
    
    var body: some View {
        Text(statusText)
            .font(.caption2)
            .fontWeight(.medium)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(backgroundColor)
            .foregroundStyle(foregroundColor)
            .clipShape(RoundedRectangle(cornerRadius: 4))
    }
    
    private var statusText: String {
        switch status {
        case .live:
            return "LIVE"
        case .completed:
            return "FT"
        case .scheduled:
            return "Upcoming"
        }
    }
    
    private var backgroundColor: Color {
        switch status {
        case .live:
            return .red.opacity(0.15)
        case .completed:
            return .gray.opacity(0.15)
        case .scheduled:
            return .green.opacity(0.15)
        }
    }
    
    private var foregroundColor: Color {
        switch status {
        case .live:
            return .red
        case .completed:
            return .secondary
        case .scheduled:
            return .green
        }
    }
}

/// Main fixtures list view
struct FixturesView: View {
    let matches: [Match]
    let isLoading: Bool
    
    var body: some View {
        Group {
            if isLoading && matches.isEmpty {
                loadingView
            } else if matches.isEmpty {
                emptyView
            } else {
                matchesList
            }
        }
    }
    
    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .controlSize(.large)
            Text("Loading fixtures...")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.top, 100)
    }
    
    private var emptyView: some View {
        VStack(spacing: 12) {
            Image(systemName: "calendar.badge.exclamationmark")
                .font(.largeTitle)
                .foregroundStyle(.secondary)
            
            Text("No fixtures available")
                .font(.headline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.top, 100)
    }
    
    private var matchesList: some View {
        LazyVStack(spacing: 12) {
            ForEach(matches) { match in
                NavigationLink(value: match) {
                    MatchCardView(match: match)
                }
                .buttonStyle(.plain)
            }
        }
        .padding()
    }
}

#Preview {
    NavigationStack {
        ScrollView {
            FixturesView(matches: MockData.matches, isLoading: false)
        }
        .background(Color(.systemGroupedBackground))
    }
}
