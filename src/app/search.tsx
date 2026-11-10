import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import PlayerCard from "../components/PlayerCard";
import { styles } from "../constants/styles";
import { Player } from "../constants/types";
import { useFavorites } from "../context/FavoritesContext";
import { getPlayersFromApi } from "../services/playerService";

// ===== SEARCH SCREEN (Modul 3: Halaman Pencarian Async) =====
export default function SearchScreen() {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [query, setQuery] = useState<string>("");
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil data dari API saat pertama kali masuk ke Search screen
  useEffect(() => {
    getPlayersFromApi()
      .then((data) => {
        setAllPlayers(data);
        setFilteredPlayers(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message || "Gagal memuat data pencarian");
        setLoading(false);
      });
  }, []);

  // Filter dinamis saat query pencarian berubah
  useEffect(() => {
    if (!query.trim()) {
      setFilteredPlayers(allPlayers);
    } else {
      const lower = query.toLowerCase();
      const filtered = allPlayers.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.mainHero.toLowerCase().includes(lower) ||
          p.team.toLowerCase().includes(lower)
      );
      setFilteredPlayers(filtered);
    }
  }, [query, allPlayers]);

  const openDetail = (p: Player) => {
    router.push({
      pathname: "/player/[id]",
      params: { id: String(p.id) },
    });
  };

  return (
    <View style={styles.detailContainer}>
      <View style={{ marginBottom: 16 }}>
        <Text style={[styles.detailName, { fontSize: 20 }]}>
          Cari Pemain / Hero
        </Text>
        <Text style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
          Cari berdasarkan nama pemain, hero utama, atau nama tim
        </Text>
      </View>

      <View style={{ position: "relative", marginBottom: 16 }}>
        <TextInput
          placeholder="Ketik nama pemain / hero..."
          placeholderTextColor="#64748b"
          value={query}
          onChangeText={setQuery}
          style={[styles.searchInput, { paddingLeft: 40 }]}
          autoFocus={false}
        />
        <Ionicons
          name="search"
          size={18}
          color="#94a3b8"
          style={{ position: "absolute", left: 12, top: 12 }}
        />
        {query ? (
          <Pressable
            onPress={() => setQuery("")}
            style={{ position: "absolute", right: 12, top: 12 }}
          >
            <Ionicons name="close-circle" size={18} color="#94a3b8" />
          </Pressable>
        ) : null}
      </View>

      {loading ? (
        <Loading message="Menyiapkan data pencarian..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <FlatList
          data={filteredPlayers}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlayerCard
              player={item}
              isFavorite={isFavorite(item.id)}
              onPress={() => openDetail(item)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Tidak ditemukan pemain dengan kata kunci "{query}"
            </Text>
          }
        />
      )}
    </View>
  );
}

