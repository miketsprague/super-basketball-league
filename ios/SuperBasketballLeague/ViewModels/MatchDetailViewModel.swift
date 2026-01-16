import Foundation

/// View model for managing match detail data
@MainActor
final class MatchDetailViewModel: ObservableObject {
    @Published var matchDetails: MatchDetails?
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var lastUpdated: Date?
    
    private var refreshTimer: Timer?
    private let liveRefreshInterval: TimeInterval = 30 // 30 seconds for live matches
    
    let matchId: String
    
    init(matchId: String) {
        self.matchId = matchId
    }
    
    deinit {
        refreshTimer?.invalidate()
    }
    
    /// Load match details from the API
    func loadMatchDetails() async {
        isLoading = true
        errorMessage = nil
        
        if let details = await APIService.shared.fetchMatchDetails(matchId: matchId) {
            matchDetails = details
            lastUpdated = Date()
            
            // Start live polling if match is live
            if details.status == .live {
                startLivePolling()
            }
        } else {
            errorMessage = "Match not found"
        }
        
        isLoading = false
    }
    
    /// Refresh match details (for pull-to-refresh or manual refresh)
    func refresh() async {
        errorMessage = nil
        
        if let details = await APIService.shared.fetchMatchDetails(matchId: matchId) {
            matchDetails = details
            lastUpdated = Date()
        }
    }
    
    /// Formatted last updated time
    var formattedLastUpdated: String {
        guard let lastUpdated = lastUpdated else { return "" }
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return "Updated: \(formatter.string(from: lastUpdated))"
    }
    
    private func startLivePolling() {
        refreshTimer?.invalidate()
        refreshTimer = Timer.scheduledTimer(withTimeInterval: liveRefreshInterval, repeats: true) { [weak self] _ in
            Task { @MainActor [weak self] in
                await self?.refresh()
            }
        }
    }
}
