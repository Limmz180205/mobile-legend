import { StyleSheet } from "react-native";

// ===== EXTERNAL STYLING (Modul 1 - 3.2) =====
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0b1020",
        paddingTop: 48,
        paddingHorizontal: 16,
    },
    header: {
        marginBottom: 12,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#facc15",
    },
    subtitle: {
        fontSize: 13,
        color: "#94a3b8",
        marginTop: 2,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 12,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: "#151c34",
        borderRadius: 12,
        padding: 10,
        marginHorizontal: 3,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#243055",
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#ffffff",
        marginTop: 4,
    },
    summaryLabel: {
        fontSize: 10,
        color: "#94a3b8",
        textAlign: "center",
    },
    searchInput: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        marginBottom: 10,
    },
    filterRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 8,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: "#151c34",
        marginRight: 6,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: "#243055",
    },
    chipActive: {
        backgroundColor: "#facc15",
        borderColor: "#facc15",
    },
    chipText: {
        color: "#cbd5e1",
        fontSize: 12,
        fontWeight: "600",
    },
    chipTextActive: {
        color: "#0b1020",
    },
    card: {
        backgroundColor: "#151c34",
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#243055",
        elevation: 4,
        shadowColor: "#000",
    },
    cardTop: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginRight: 12,
        backgroundColor: "#243055",
    },
    playerName: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#ffffff",
    },
    playerTeam: {
        fontSize: 12,
        color: "#94a3b8",
    },
    badge: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#0b1020",
        backgroundColor: "#facc15",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        overflow: "hidden",
        marginTop: 4,
        alignSelf: "flex-start",
    },
    gradeBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    gradeText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0b1020",
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },
    statBox: {
        alignItems: "center",
        flex: 1,
    },
    statValue: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#ffffff",
    },
    statLabel: {
        fontSize: 10,
        color: "#94a3b8",
    },
    detailBox: {
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#243055",
    },
    detailText: {
        color: "#cbd5e1",
        fontSize: 12,
        marginBottom: 4,
    },
    favButton: {
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
    },
    emptyText: {
        color: "#94a3b8",
        textAlign: "center",
        marginTop: 30,
    },
});
