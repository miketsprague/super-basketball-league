import SwiftUI

/// Tab selection enum
enum Tab {
    case fixtures
    case table
}

/// Home view with tab-based navigation
struct HomeView: View {
    @StateObject private var viewModel = HomeViewModel()
    @State private var selectedTab: Tab = .fixtures
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Custom Tab Bar
                tabBar
                
                // Tab Content
                TabView(selection: $selectedTab) {
                    ScrollView {
                        FixturesView(matches: viewModel.matches, isLoading: viewModel.isLoading)
                    }
                    .tag(Tab.fixtures)
                    .refreshable {
                        await viewModel.refresh()
                    }
                    
                    ScrollView {
                        LeagueTableView(standings: viewModel.standings, isLoading: viewModel.isLoading)
                    }
                    .tag(Tab.table)
                    .refreshable {
                        await viewModel.refresh()
                    }
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("🏀 Super Basketball League")
            .navigationBarTitleDisplayMode(.inline)
            .navigationDestination(for: Match.self) { match in
                MatchDetailView(matchId: match.id)
            }
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("🏀 Super Basketball League")
                        .font(.headline)
                }
            }
        }
        .task {
            await viewModel.loadData()
        }
    }
    
    private var tabBar: some View {
        HStack(spacing: 0) {
            tabButton(title: "Fixtures & Results", tab: .fixtures)
            tabButton(title: "League Table", tab: .table)
        }
        .background(Color(.systemBackground))
        .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 2)
    }
    
    private func tabButton(title: String, tab: Tab) -> some View {
        Button {
            withAnimation(.easeInOut(duration: 0.2)) {
                selectedTab = tab
            }
        } label: {
            VStack(spacing: 8) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundStyle(selectedTab == tab ? .orange : .secondary)
                
                Rectangle()
                    .fill(selectedTab == tab ? Color.orange : Color.clear)
                    .frame(height: 2)
            }
            .frame(maxWidth: .infinity)
            .padding(.top, 12)
            .background(selectedTab == tab ? Color.orange.opacity(0.05) : Color.clear)
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    HomeView()
}
