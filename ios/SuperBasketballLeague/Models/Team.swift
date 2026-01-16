import Foundation

/// Represents a basketball team
struct Team: Identifiable, Codable, Hashable {
    let id: String
    let name: String
    let shortName: String
    var logo: String?
}
