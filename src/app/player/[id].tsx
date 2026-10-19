import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../../constants/styles";
import { DetailTab } from "../../constants/types";
import { useFavorites } from "../../context/FavoritesContext";
import { players } from "../../data/players";
import {
  findPlayerById,
  getGrade,
  getKDA,
  getRoleColor,
  getWinRate,
} from "../../utils/helpers";

// ===== DYNAMIC ROUTE: file [id].tsx -> /player/1, /player/2, /player/g3 ... =====
export default function PlayerDetail() {
  // useLocalSearchParams (Modul 2 - 2.6): ambil parameter dari URL.
  // id  = bagian dinamis  /player/<id>
  // tab = query parameter /player/<id>?tab=profile  (opsional)
  const { id, tab } = useLocalSearchParams<{ id: string; tab?: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const player = findPlayerById(players, id);
  const activeTab: DetailTab = tab === "profile" ? "profile" : "stats";

  // useMemo: statistik dihitung ulang hanya kalau pemainnya berganti
  const stats = useMemo(() => {
    if (!player) return null;
    const winRate = getWinRate(player);
    const kda = getKDA(player);
    return { winRate, kda, grade: getGrade(winRate, kda) };
  }, [player]);

  // useEffect: kalau id tidak ditemukan, ganti halaman ini dengan Home.
  // router.replace() = halaman rusak ini DIHAPUS dari riwayat (Modul 2 - 3.2 B)
  useEffect(() => {
    if (!player) {
      router.replace("/");
    }
  }, [player, router]);

  // (Semua hook harus ada SEBELUM return bersyarat seperti ini)
  if (!player || !stats) {
    return null;
  }

  // router.canGoBack() (Modul 2 - 3.2 C): cek dulu ada halaman untuk kembali atau tidak
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back(); // kembali ke halaman sebelumnya (Modul 2 - 3.2 A)
    } else {
      router.replace("/"); // fallback supaya pengguna tidak terjebak
    }
  };

  // router.setParams() (Modul 2 - 3.2 G): ubah parameter halaman AKTIF
  // tanpa berpindah halaman. Nilai tab di URL berubah -> tampilan ikut berubah.
  const switchTab = (t: DetailTab) => {
    router.setParams({ tab: t });
  };

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
      {/* Stack.Screen di dalam halaman: judul header mengikuti nama pemain */}
      <Stack.Screen options={{ title: player.name }} />

      <View style={styles.detailHeader}>
        <Image
          source={{ uri: `https://picsum.photos/seed/${player.name}/200` }}
          style={styles.detailAvatar}
        />
        <Text style={styles.detailName}>{player.name}</Text>
        <Text style={{ color: roleColor, fontWeight: "bold" }}>
          {player.role} • {player.mainHero}
        </Text>
      </View>

      {/* Tab: dua tombol yang memanggil setParams */}
      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tabButton, activeTab === "stats" && styles.tabButtonActive]}
          onPress={() => switchTab("stats")}
        >
          <Text style={[styles.tabText, activeTab === "stats" && styles.tabTextActive]}>
            Statistik
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, activeTab === "profile" && styles.tabButtonActive]}
          onPress={() => switchTab("profile")}
        >
          <Text style={[styles.tabText, activeTab === "profile" && styles.tabTextActive]}>
            Profil
          </Text>
        </Pressable>
      </View>

      {activeTab === "stats" && (
        <View>
          <Text style={styles.infoLabel}>Win Rate: {stats.winRate.toFixed(1)}%</Text>
          <View style={styles.progressTrack}>
            {/* INLINE STYLE: lebar bar mengikuti nilai win rate */}
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
        <Pressable style={styles.primaryButton} onPress={() => toggleFavorite(player.id)}>
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
