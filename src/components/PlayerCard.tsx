import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../constants/styles";
import { Player } from "../constants/types";
import { getGrade, getKDA, getRoleColor, getWinRate } from "../utils/helpers";

// Props komponen didefinisikan dengan interface (Modul 1: interface)
interface PlayerCardProps {
    player: Player;
    isFavorite: boolean;
    onPress: () => void; // callback: dijalankan saat kartu ditekan
    onLongPress?: () => void; // opsional
    onToggleFavorite: () => void;
}

// Komponen dipakai di halaman Home DAN halaman Favorit (tidak copy-paste)
export default function PlayerCard({
    player,
    isFavorite,
    onPress,
    onLongPress,
    onToggleFavorite,
}: PlayerCardProps) {
    const winRate = getWinRate(player);
    const kda = getKDA(player);
    const grade = getGrade(winRate, kda);
    const roleColor = getRoleColor(player.role);

    return (
        <Pressable style={styles.card} onPress={onPress} onLongPress={onLongPress}>
            <View style={styles.cardTop}>
                <Image
                    source={{ uri: `https://picsum.photos/seed/${player.name}/100` }}
                    style={styles.avatar}
                />
                <View style={{ flex: 1 }}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerTeam}>
                        {player.team} • {player.mainHero}
                    </Text>
                    {player.badge ? <Text style={styles.badge}>{player.badge}</Text> : null}
                </View>

                <Pressable onPress={onToggleFavorite} style={styles.heartButton}>
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={22}
                        color={isFavorite ? "#ef4444" : "#94a3b8"}
                    />
                </Pressable>

                {/* INLINE STYLE: warna kotak grade mengikuti role */}
                <View style={[styles.gradeBox, { backgroundColor: roleColor }]}>
                    <Text style={styles.gradeText}>{grade}</Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{winRate.toFixed(1)}%</Text>
                    <Text style={styles.statLabel}>Win Rate</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{kda.toFixed(2)}</Text>
                    <Text style={styles.statLabel}>KDA</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{player.matches}</Text>
                    <Text style={styles.statLabel}>Match</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={{ fontSize: 13, fontWeight: "bold", color: roleColor }}>
                        {player.role}
                    </Text>
                    <Text style={styles.statLabel}>Role</Text>
                </View>
            </View>
        </Pressable>
    );
}
