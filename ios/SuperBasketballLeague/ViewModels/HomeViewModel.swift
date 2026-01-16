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
    private var isAppActive = true
    
    init() {
        setupNotificationObservers()
        startAutoRefresh()
    }
    
    deinit {
        refreshTimer?.invalidate()
        NotificationCenter.default.removeObserver(self)
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
    
    private func setupNotificationObservers() {
        NotificationCenter.default.addObserver(
            forName: UIApplication.didBecomeActiveNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.handleAppBecameActive()
        }
        
        NotificationCenter.default.addObserver(
            forName: UIApplication.willResignActiveNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.handleAppWillResignActive()
        }
    }
    
    private func handleAppBecameActive() {
        isAppActive = true
        startAutoRefresh()
        Task {
            await refresh()
        }
    }
    
    private func handleAppWillResignActive() {
        isAppActive = false
        refreshTimer?.invalidate()
        refreshTimer = nil
    }
    
    private func startAutoRefresh() {
        guard isAppActive else { return }
        refreshTimer?.invalidate()
        refreshTimer = Timer.scheduledTimer(withTimeInterval: refreshInterval, repeats: true) { [weak self] _ in
            Task { @MainActor [weak self] in
                guard self?.isAppActive == true else { return }
                await self?.refresh()
            }
        }
    }
}
