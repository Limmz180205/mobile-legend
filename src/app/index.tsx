import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../constants/styles";
import { Player, SummaryItem, Role } from "../constants/types";
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
  // ----- VARIABLE (const & let, tipe eksplisit, union type) -----
  const appName: string = "MLBB Stats Hub";
  const [search, setSearch] = useState<string>("");
  const [activeRole, setActiveRole] = useState<Role | "All">("All");
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [favorites, setFavorites] = useState<(string | number)[]>([]);

  // ----- CALLBACK: filter data memakai fungsi yang dikirim sebagai argumen -----
  const visiblePlayers: Player[] = Helper.filterPlayers(
    players,
    (p) =>
      (activeRole === "All" || p.role === activeRole) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  );

  // ----- Data ringkasan (Array of Object bertipe SummaryItem) -----
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

  const summary: SummaryItem[] = [
    { id: "s1", label: "Pemain", value: `${visiblePlayers.length}`, icon: "people" },
    { id: "s2", label: "Total Match", value: Helper.formatNumber(totalMatches), icon: "game-controller" },
    { id: "s3", label: "Total Kill", value: Helper.formatNumber(totalKills), icon: "skull" },
    { id: "s4", label: "Rata² WR", value: `${avgWinRate.toFixed(1)}%`, icon: "trophy" },
  ];

  // ----- FUNCTION BAWAAN (Alert) dibungkus custom function -----
  const showPlayerAlert = (p: Player) => {
    Alert.alert(
      `${p.name} (${p.team})`,
      `Hero utama: ${p.mainHero}\nRank: ${p.rank}\nWin rate: ${hitungWinRate(p).toFixed(1)}%`,
    );
  };

  const toggleFavorite = (id: string | number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
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

  // ----- CUSTOM FUNCTION: kartu pemain untuk FlatList -----
  const renderPlayerCard = ({ item }: { item: Player }) => {
    const winRate = hitungWinRate(item);
    const kda = Helper.getKDA(item);
    const grade = Helper.getGrade(winRate, kda);
    const isOpen = expandedId === item.id;
    const isFav = favorites.includes(item.id);

    return (
      <Pressable
        style={styles.card}
        onPress={() => setExpandedId(isOpen ? null : item.id)}
        onLongPress={() => showPlayerAlert(item)}
      >
        <View style={styles.cardTop}>
          <Image
            source={{ uri: `https://picsum.photos/seed/${item.name}/100` }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.playerName}>{item.name}</Text>
            <Text style={styles.playerTeam}>
              {item.team} • {item.mainHero}
            </Text>
            {/* Conditional rendering: badge opsional (properti "?") */}
            {item.badge ? <Text style={styles.badge}>{item.badge}</Text> : null}
          </View>
          <View
            style={[
              styles.gradeBox,
              { backgroundColor: Helper.getRoleColor(item.role) },
            ]}
          >
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
            <Text style={styles.statValue}>{item.matches}</Text>
            <Text style={styles.statLabel}>Match</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={{ fontSize: 13, fontWeight: "bold", color: Helper.getRoleColor(item.role) }}>
              {item.role}
            </Text>
            <Text style={styles.statLabel}>Role</Text>
          </View>
        </View>

        {isOpen && (
          <View style={styles.detailBox}>
            <Text style={styles.detailText}>Rank: {item.rank}</Text>
            <Text style={styles.detailText}>
              K/D/A: {item.kills} / {item.deaths} / {item.assists}
            </Text>
            <Pressable style={styles.favButton} onPress={() => toggleFavorite(item.id)}>
              <Ionicons
                name={isFav ? "heart" : "heart-outline"}
                size={18}
                color={isFav ? "#ef4444" : "#94a3b8"}
              />
              <Text style={{ color: "#cbd5e1", marginLeft: 6, fontSize: 12 }}>
                {isFav ? "Hapus dari favorit" : "Tambah ke favorit"}
              </Text>
            </Pressable>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Komentar di dalam component */}
      <View style={styles.header}>
        <Text style={styles.title}>
          <Ionicons name="flash" size={24} color="#facc15" /> {appName}
        </Text>
        <Text style={styles.subtitle}>
          Aplikasi statistik pemain Mobile Legends • ❤ Favorit: {favorites.length}
        </Text>
      </View>

      {/* map() + custom function */}
      <View style={styles.summaryRow}>{summary.map(renderSummaryCard)}</View>

      <TextInput
        placeholder="Cari nama pemain..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <View style={styles.filterRow}>{roleChips}</View>

      <FlatList
        data={visiblePlayers}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderPlayerCard}
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
    </View>
  );
}
