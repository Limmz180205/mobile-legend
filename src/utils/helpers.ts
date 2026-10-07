import { Player } from "../constants/types";

// ===== CUSTOM FUNCTIONS (Modul 1 - 5.3 B) =====

// Menghitung win rate (%) -> dikembalikan sebagai number
export const getWinRate = (player: Player): number => {
    if (player.matches === 0) return 0;
    return (player.wins / player.matches) * 100;
};

// Menghitung KDA = (Kill + Assist) / Death
export const getKDA = (player: Player): number => {
    const deaths = player.deaths === 0 ? 1 : player.deaths;
    return (player.kills + player.assists) / deaths;
};

// CONDITIONS (if / else if / else) -> menentukan grade pemain
export function getGrade(winRate: number, kda: number): string {
    const score = winRate * 0.6 + Math.min(kda, 5) * 8;
    if (score >= 90) {
        return "S";
    } else if (score >= 75) {
        return "A";
    } else if (score >= 60) {
        return "B";
    } else {
        return "C";
    }
}

// SWITCH CASE -> warna sesuai role
export function getRoleColor(role: Player["role"]): string {
    switch (role) {
        case "Tank":
            return "#0ea5e9";
        case "Fighter":
            return "#f97316";
        case "Assassin":
            return "#ef4444";
        case "Mage":
            return "#a855f7";
        case "Marksman":
            return "#eab308";
        case "Support":
            return "#22c55e";
        default:
            return "#94a3b8";
    }
}

// Format angka dengan template literal
export const formatNumber = (n: number): string =>
    n.toLocaleString("id-ID");

// CALLBACK FUNCTION (bonus): fungsi dikirim sebagai argumen
export function filterPlayers(
    list: Player[],
    predicate: (p: Player) => boolean,
): Player[] {
    const result: Player[] = [];
    for (const p of list) {
        if (predicate(p)) result.push(p);
    }
    return result;
}
