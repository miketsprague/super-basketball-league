import SwiftUI

/// League table view showing standings
struct LeagueTableView: View {
    let standings: [StandingsEntry]
    let isLoading: Bool
    
    private let playoffPositions = 4
    private let relegationSpots = 2
    
    var body: some View {
        Group {
            if isLoading && standings.isEmpty {
                loadingView
            } else if standings.isEmpty {
                emptyView
            } else {
                tableContent
            }
        }
    }
    
    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .controlSize(.large)
            Text("Loading standings...")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.top, 100)
    }
    
    private var emptyView: some View {
        VStack(spacing: 12) {
            Image(systemName: "tablecells")
                .font(.largeTitle)
                .foregroundStyle(.secondary)
            
            Text("No standings available")
                .font(.headline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.top, 100)
    }
    
    private var tableContent: some View {
        VStack(spacing: 0) {
            // Table Header
            tableHeader
            
            // Table Rows
            ForEach(standings) { entry in
                tableRow(for: entry)
            }
            
            // Legend
            legend
        }
        .padding()
    }
    
    private var tableHeader: some View {
        HStack(spacing: 0) {
            Text("#")
                .frame(width: 30, alignment: .leading)
            
            Text("Team")
                .frame(maxWidth: .infinity, alignment: .leading)
            
            Text("P")
                .frame(width: 30, alignment: .center)
            
            Text("W")
                .frame(width: 30, alignment: .center)
            
            Text("L")
                .frame(width: 30, alignment: .center)
            
            Text("+/-")
                .frame(width: 45, alignment: .center)
            
            Text("Pts")
                .frame(width: 35, alignment: .center)
                .fontWeight(.semibold)
        }
        .font(.caption)
        .foregroundStyle(.white)
        .padding(.vertical, 12)
        .padding(.horizontal, 8)
        .background(Color(.darkGray))
    }
    
    private func tableRow(for entry: StandingsEntry) -> some View {
        let isPlayoff = entry.position <= playoffPositions
        let isRelegation = entry.position > standings.count - relegationSpots && standings.count > relegationSpots
        
        return HStack(spacing: 0) {
            Text("\(entry.position)")
                .frame(width: 30, alignment: .leading)
                .foregroundStyle(.secondary)
            
            Text(entry.team.shortName)
                .frame(maxWidth: .infinity, alignment: .leading)
                .fontWeight(.medium)
                .lineLimit(1)
            
            Text("\(entry.played)")
                .frame(width: 30, alignment: .center)
                .foregroundStyle(.secondary)
            
            Text("\(entry.won)")
                .frame(width: 30, alignment: .center)
                .foregroundStyle(.secondary)
            
            Text("\(entry.lost)")
                .frame(width: 30, alignment: .center)
                .foregroundStyle(.secondary)
            
            Text(entry.formattedPointsDifference)
                .frame(width: 45, alignment: .center)
                .foregroundStyle(.secondary)
                .font(.caption)
            
            Text("\(entry.points)")
                .frame(width: 35, alignment: .center)
                .fontWeight(.bold)
                .foregroundStyle(.orange)
        }
        .font(.subheadline)
        .padding(.vertical, 10)
        .padding(.horizontal, 8)
        .background(rowBackground(isPlayoff: isPlayoff, isRelegation: isRelegation))
    }
    
    private func rowBackground(isPlayoff: Bool, isRelegation: Bool) -> some View {
        Group {
            if isPlayoff {
                Color.green.opacity(0.1)
            } else if isRelegation {
                Color.red.opacity(0.1)
            } else {
                Color(.systemBackground)
            }
        }
    }
    
    private var legend: some View {
        HStack(spacing: 16) {
            HStack(spacing: 4) {
                Rectangle()
                    .fill(Color.green.opacity(0.3))
                    .frame(width: 12, height: 12)
                    .border(Color.gray.opacity(0.3), width: 0.5)
                
                Text("Playoff positions")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
            
            HStack(spacing: 4) {
                Rectangle()
                    .fill(Color.red.opacity(0.3))
                    .frame(width: 12, height: 12)
                    .border(Color.gray.opacity(0.3), width: 0.5)
                
                Text("Relegation zone")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
            
            Spacer()
        }
        .padding(.top, 16)
    }
}

#Preview {
    ScrollView {
        LeagueTableView(standings: MockData.standings, isLoading: false)
    }
    .background(Color(.systemGroupedBackground))
}
