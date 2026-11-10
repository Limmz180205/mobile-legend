import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import PlayerCard from "../components/PlayerCard";
import StatCard from "../components/StatCard";
import { styles } from "../constants/styles";
import { Player, Role, SummaryItem } from "../constants/types";
import { useFavorites } from "../context/FavoritesContext";
import { getPlayersFromApi } from "../services/playerService";
import * as Helper from "../utils/helpers";
import { getWinRate as hitungWinRate } from "../utils/helpers";

const ROLE_FILTERS: (Role | "All")[] = [
  "All",
  "Tank",
  "Fighter",
  "Assassin",
  "Mage",
  "Marksman",
  "Support",
];

export default function Index() {
  const router = useRouter();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const appName: string = "MLBB Stats Hub";
  const [search, setSearch] = useState<string>("");
  const [activeRole, setActiveRole] = useState<Role | "All">("All");

  // ===== STATE ASYNCHRONOUS (Modul 3: Lifecycle data fetching) =====
  const [playersData, setPlayersData] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const listRef = useRef<FlatList<Player>>(null);

  /**
   * Mengambil data dari API menggunakan Promise .then() dan .catch()
   * (Kriteria Penilaian Modul 3: Menggunakan fungsi .then(), .resolve(), .reject())
   */
  const loadPlayers = useCallback(() => {
    setLoading(true);
    setError(null);

    getPlayersFromApi()
      .then((data: Player[]) => {
        setPlayersData(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message || "Gagal memuat data dari server");
        setLoading(false);
      });
  }, []);

  // Fetch data saat pertama kali komponen dirender (mount)
  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  /**
   * Pull-to-refresh menggunakan custom async function & await
   * (Kriteria Penilaian Modul 3: Custom & Pre-built Async Function)
   */
  const onRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const freshData = await getPlayersFromApi();
      setPlayersData(freshData);
    } catch (err: any) {
      setError(err?.message || "Gagal menyegarkan data");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [search, activeRole]);

  // Filter pemain berdasarkan search bar dan chip role
  const visiblePlayers: Player[] = useMemo(
    () =>
      Helper.filterPlayers(
        playersData,
        (p) =>
          (activeRole === "All" || p.role === activeRole) &&
          p.name.toLowerCase().includes(search.toLowerCase())
      ),
    [playersData, search, activeRole]
  );

  // Data ringkasan (SummaryItem) dihitung dinamis dari visiblePlayers
  const summary: SummaryItem[] = useMemo(() => {
    let totalMatches = 0;
    let totalKills = 0;
    for (let i = 0; i < visiblePlayers.length; i++) {
      totalMatches += visiblePlayers[i].matches;
      totalKills += visiblePlayers[i].kills;
    }
    const avgWinRate =
      visiblePlayers.length > 0
        ? visiblePlayers.reduce((sum, p) => sum + hitungWinRate(p), 0) /
        visiblePlayers.length
        : 0;

    return [
      { id: "s1", label: "Pemain", value: `${visiblePlayers.length}`, icon: "people" },
      {
        id: "s2",
        label: "Total Match",
        value: Helper.formatNumber(totalMatches),
        icon: "game-controller",
      },
      {
        id: "s3",
        label: "Total Kill",
        value: Helper.formatNumber(totalKills),
        icon: "skull",
      },
      {
        id: "s4",
        label: "Rata² WR",
        value: `${avgWinRate.toFixed(1)}%`,
        icon: "trophy",
      },
    ];
  }, [visiblePlayers]);

  const openDetail = (p: Player) => {
    router.push({
      pathname: "/player/[id]",
      params: { id: String(p.id) },
    });
  };

  const resetFilter = () => {
    setSearch("");
    setActiveRole("All");
  };

  const roleChips = [];
  for (let i = 0; i < ROLE_FILTERS.length; i++) {
    const role = ROLE_FILTERS[i];
    const isActive = role === activeRole;
    roleChips.push(
      <Pressable
        key={role}
        onPress={() => setActiveRole(role)}
        style={[styles.chip, isActive && styles.chipActive]}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: isActive ? "bold" : "600",
            color: isActive ? "#0b1020" : "#cbd5e1",
          }}
        >
          {role}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>
            <Ionicons name="flash" size={24} color="#facc15" /> {appName}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {/* Tombol ke Search Screen khusus (sesuai Modul 3) */}
            <Pressable
              style={[styles.favLink, { backgroundColor: "#1e293b" }]}
              onPress={() => router.push("/search")}
            >
              <Ionicons name="search" size={16} color="#facc15" />
            </Pressable>

            {/* Navigasi ke halaman Favorit */}
            <Pressable
              style={styles.favLink}
              onPress={() => router.push("/favorites")}
            >
              <Ionicons name="heart" size={16} color="#f31515" />
              <Text style={styles.favLinkText}>{favorites.length}</Text>
            </Pressable>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Aplikasi statistik pemain Mobile Legends (Modul 3: Async & API)
        </Text>
      </View>

      {/* Ringkasan Statistik memakai Reusable Component StatCard */}
      <View style={styles.summaryRow}>
        {summary.map((item) => (
          <StatCard key={item.id} item={item} />
        ))}
      </View>

      <TextInput
        placeholder="Cari nama pemain..."
        placeholderTextColor="#64748b"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <View style={styles.filterRow}>{roleChips}</View>

      {/* Conditional Rendering State Asynchronous */}
      {loading ? (
        <Loading message="Mengambil data pemain dari External API..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadPlayers} />
      ) : (
        <FlatList
          ref={listRef}
          data={visiblePlayers}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#facc15"
              colors={["#facc15"]}
            />
          }
          renderItem={({ item }) => (
            <PlayerCard
              player={item}
              isFavorite={isFavorite(item.id)}
              onPress={() => openDetail(item)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Pemain tidak ditemukan 😢</Text>
          }
          ListFooterComponent={
            <View style={{ marginBottom: 24 }}>
              <Button title="Reset Filter" onPress={resetFilter} />
            </View>
          }
        />
      )}
    </View>
  );
}