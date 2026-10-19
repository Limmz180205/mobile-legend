import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import PlayerCard from "../components/PlayerCard";
import { styles } from "../constants/styles";
import { Player, Role, SummaryItem } from "../constants/types";
import { useFavorites } from "../context/FavoritesContext";
import { players } from "../data/players";
import * as Helper from "../utils/helpers"; // import * as (Modul 1 - 1.1)
import { getWinRate as hitungWinRate } from "../utils/helpers"; // import ... as

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
  // ----- ROUTER (Modul 2 - 3.2): objek untuk berpindah halaman lewat kode -----
  const router = useRouter();

  // ----- useContext: ambil data favorit yang dibagikan Provider di _layout -----
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // ----- useState (Modul 2 - 2.1) -----
  const appName: string = "MLBB Stats Hub";
  const [search, setSearch] = useState<string>("");
  const [activeRole, setActiveRole] = useState<Role | "All">("All");
  const [loading, setLoading] = useState<boolean>(true);

  // ----- useRef (Modul 2 - 2.3): nilai/objek yang tidak memicu re-render -----
  const listRef = useRef<FlatList<Player>>(null);

  // ----- useEffect (Modul 2 - 2.2) -----
  // [] = jalan SEKALI setelah render pertama: pura-pura "memuat data" 0,8 detik
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer); // cleanup saat komponen dilepas
  }, []);

  // [search, activeRole] = jalan setiap salah satunya berubah: scroll ke atas
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [search, activeRole]);

  // ----- useMemo (Modul 2 - 2.5): hasil filter disimpan, dihitung ulang
  //       hanya kalau search / activeRole berubah -----
  // CALLBACK: fungsi dikirim sebagai argumen ke filterPlayers (Modul 1)
  const visiblePlayers: Player[] = useMemo(
    () =>
      Helper.filterPlayers(
        players,
        (p) =>
          (activeRole === "All" || p.role === activeRole) &&
          p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, activeRole],
  );

  // Data ringkasan (Array of Object bertipe SummaryItem), dihitung dengan useMemo
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
      { id: "s2", label: "Total Match", value: Helper.formatNumber(totalMatches), icon: "game-controller" },
      { id: "s3", label: "Total Kill", value: Helper.formatNumber(totalKills), icon: "skull" },
      { id: "s4", label: "Rata² WR", value: `${avgWinRate.toFixed(1)}%`, icon: "trophy" },
    ];
  }, [visiblePlayers]);

  // ----- NAVIGASI: router.push() menumpuk halaman baru (Modul 2 - 3.2 A) -----
  // Rute dinamis app/player/[id].tsx: id dikirim lewat params
  const openDetail = (p: Player) => {
    router.push({
      pathname: "/player/[id]",
      params: { id: String(p.id) },
    });
  };

  // ----- FUNCTION BAWAAN (Alert) dibungkus custom function -----
  const showPlayerAlert = (p: Player) => {
    Alert.alert(
      `${p.name} (${p.team})`,
      `Hero utama: ${p.mainHero}\nRank: ${p.rank}\nWin rate: ${hitungWinRate(p).toFixed(1)}%`,
    );
  };

  const resetFilter = () => {
    setSearch("");
    setActiveRole("All");
  };

  // ----- CUSTOM FUNCTION: kartu ringkasan (dipakai dengan map()) -----
  const renderSummaryCard = (item: SummaryItem) => (
    <View key={item.id} style={styles.summaryCard}>
      <Ionicons name={item.icon} size={20} color="#facc15" />
      <Text style={styles.summaryValue}>{item.value}</Text>
      <Text style={styles.summaryLabel}>{item.label}</Text>
    </View>
  );

  // ----- PRIMITIVE LOOP: for + push() di luar return (Modul 1 - 5.4 C) -----
  const roleChips = [];
  for (let i = 0; i < ROLE_FILTERS.length; i++) {
    const role = ROLE_FILTERS[i];
    const isActive = role === activeRole;
    roleChips.push(
      <Pressable
        key={role}
        onPress={() => setActiveRole(role)}
        // INLINE STYLING: nilai bergantung pada variabel dinamis
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
      </Pressable>,
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>
            <Ionicons name="flash" size={24} color="#facc15" /> {appName}
          </Text>

          {/* Navigasi ke halaman Favorit */}
          <Pressable style={styles.favLink} onPress={() => router.push("/favorites")}>
            <Ionicons name="heart" size={16} color="#ef4444" />
            <Text style={styles.favLinkText}>{favorites.length}</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>
          Aplikasi statistik pemain Mobile Legends
        </Text>
      </View>

      <View style={styles.summaryRow}>{summary.map(renderSummaryCard)}</View>

      <TextInput
        placeholder="Cari nama pemain..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <View style={styles.filterRow}>{roleChips}</View>

      {/* Conditional rendering berdasarkan state loading */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#facc15" />
          <Text style={styles.emptyText}>Memuat data pemain...</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={visiblePlayers}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlayerCard
              player={item}
              isFavorite={isFavorite(item.id)}
              onPress={() => openDetail(item)}
              onLongPress={() => showPlayerAlert(item)}
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