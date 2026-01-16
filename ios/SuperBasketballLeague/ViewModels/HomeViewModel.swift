import Foundation
import SwiftUI

/// View model for managing fixtures and standings data
@MainActor
final class HomeViewModel: ObservableObject {
    @Published var matches: [Match] = []
    @Published var standings: [StandingsEntry] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var refreshTimer: Timer?
    private let refreshInterval: TimeInterval = 5 * 60 // 5 minutes
    
    init() {
        startAutoRefresh()
    }
    
    deinit {
        refreshTimer?.invalidate()
    }
    
    /// Load all data from the API
    func loadData() async {
        isLoading = true
        errorMessage = nil
        
        let (fetchedMatches, fetchedStandings) = await APIService.shared.fetchAllData()
        
        matches = fetchedMatches
        standings = fetchedStandings
        isLoading = false
    }
    
    /// Refresh data (pull-to-refresh)
    func refresh() async {
        errorMessage = nil
        let (fetchedMatches, fetchedStandings) = await APIService.shared.fetchAllData()
        matches = fetchedMatches
        standings = fetchedStandings
    }
    
    private func startAutoRefresh() {
        refreshTimer = Timer.scheduledTimer(withTimeInterval: refreshInterval, repeats: true) { [weak self] _ in
            Task { @MainActor [weak self] in
                await self?.refresh()
            }
        }
    }
}
