import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import { styles } from "../../constants/styles";
import { DetailTab, Player } from "../../constants/types";
import { useFavorites } from "../../context/FavoritesContext";
import { getPlayerByIdFromApi } from "../../services/playerService";
import {
  getGrade,
  getKDA,
  getRoleColor,
  getWinRate,
} from "../../utils/helpers";

// ===== DYNAMIC ROUTE: file [id].tsx -> /player/1, /player/101, dst =====
export default function PlayerDetail() {
  const { id, tab } = useLocalSearchParams<{ id: string; tab?: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  // State asynchronous untuk data detail
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const activeTab: DetailTab = tab === "profile" ? "profile" : "stats";

  // Ambil detail player dari API secara asynchronous berdasarkan ID
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    getPlayerByIdFromApi(id)
      .then((data) => {
        if (!data) {
          setError("Pemain tidak ditemukan");
        } else {
          setPlayer(data);
        }
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message || "Gagal mengambil detail pemain");
        setLoading(false);
      });
  }, [id]);

  const stats = useMemo(() => {
    if (!player) return null;
    const winRate = getWinRate(player);
    const kda = getKDA(player);
    return { winRate, kda, grade: getGrade(winRate, kda) };
  }, [player]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const switchTab = (t: DetailTab) => {
    router.setParams({ tab: t });
  };

  if (loading) {
    return (
      <View style={[styles.detailContainer, { justifyContent: "center" }]}>
        <Stack.Screen options={{ title: "Memuat Detail..." }} />
        <Loading message="Mengambil data detail pemain dari server..." />
      </View>
    );
  }

  if (error || !player || !stats) {
    return (
      <View style={[styles.detailContainer, { justifyContent: "center" }]}>
        <Stack.Screen options={{ title: "Pemain Tidak Ditemukan" }} />
        <ErrorMessage
          message={error || "Pemain tidak ditemukan"}
          onRetry={handleBack}
        />
      </View>
    );
  }

  const roleColor = getRoleColor(player.role);
  const fav = isFavorite(player.id);

  const rows: { label: string; value: string }[] =
    activeTab === "stats"
      ? [
          { label: "Total Match", value: `${player.matches}` },
          { label: "Menang", value: `${player.wins}` },
          { label: "Kill", value: `${player.kills}` },
          { label: "Death", value: `${player.deaths}` },
          { label: "Assist", value: `${player.assists}` },
          { label: "KDA", value: stats.kda.toFixed(2) },
        ]
      : [
          { label: "Tim", value: player.team },
          { label: "Role", value: player.role },
          { label: "Hero Utama", value: player.mainHero },
          { label: "Rank", value: player.rank },
          { label: "Badge", value: player.badge ?? "-" },
          { label: "Grade", value: stats.grade },
        ];

  return (
    <ScrollView style={styles.detailContainer}>
      <Stack.Screen options={{ title: player.name }} />

      <View style={styles.detailHeader}>
        <Image
          source={{ uri: player.avatar || `https://picsum.photos/seed/${player.name}/200` }}
          style={styles.detailAvatar}
        />
        <Text style={styles.detailName}>{player.name}</Text>
        <Text style={{ color: roleColor, fontWeight: "bold" }}>
          {player.role} • {player.mainHero}
        </Text>
      </View>

      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tabButton, activeTab === "stats" && styles.tabButtonActive]}
          onPress={() => switchTab("stats")}
        >
          <Text
            style={[styles.tabText, activeTab === "stats" && styles.tabTextActive]}
          >
            Statistik
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tabButton,
            activeTab === "profile" && styles.tabButtonActive,
          ]}
          onPress={() => switchTab("profile")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "profile" && styles.tabTextActive,
            ]}
          >
            Profil
          </Text>
        </Pressable>
      </View>

      {activeTab === "stats" && (
        <View>
          <Text style={styles.infoLabel}>Win Rate: {stats.winRate.toFixed(1)}%</Text>
          <View style={styles.progressTrack}>
            <View
              style={{
                width: `${Math.min(stats.winRate, 100)}%`,
                height: "100%",
                backgroundColor: roleColor,
              }}
            />
          </View>
        </View>
      )}

      {rows.map((row) => (
        <View key={row.label} style={styles.infoRow}>
          <Text style={styles.infoLabel}>{row.label}</Text>
          <Text style={styles.infoValue}>{row.value}</Text>
        </View>
      ))}

      <View style={styles.actionRow}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => toggleFavorite(player.id)}
        >
          <Ionicons
            name={fav ? "heart" : "heart-outline"}
            size={18}
            color={fav ? "#ef4444" : "#0b1020"}
          />
          <Text style={styles.primaryButtonText}>
            {fav ? "Hapus Favorit" : "Tambah Favorit"}
          </Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={handleBack}>
          <Text style={styles.secondaryButtonText}>Kembali</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.secondaryButton, { marginTop: 10, flex: 0 }]}
        onPress={() => router.push("/favorites")}
      >
        <Text style={styles.secondaryButtonText}>Lihat Daftar Favorit</Text>
      </Pressable>
    </ScrollView>
  );
}
