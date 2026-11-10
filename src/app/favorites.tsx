import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Loading from "../components/Loading";
import PlayerCard from "../components/PlayerCard";
import { styles } from "../constants/styles";
import { Player } from "../constants/types";
import { useFavorites } from "../context/FavoritesContext";
import { getPlayersFromApi } from "../services/playerService";
import { filterPlayers } from "../utils/helpers";

// ===== FAVORITES SCREEN (Modul 3: Async List Rendering) =====
export default function Favorites() {
  const router = useRouter();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Ambil data pemain dari API
  useEffect(() => {
    getPlayersFromApi()
      .then((data) => {
        setAllPlayers(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const favPlayers: Player[] = filterPlayers(allPlayers, (p) =>
    favorites.includes(p.id)
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <View style={styles.detailContainer}>
      {loading ? (
        <Loading message="Memuat daftar favorit..." />
      ) : (
        <FlatList
          data={favPlayers}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlayerCard
              player={item}
              isFavorite={isFavorite(item.id)}
              onPress={() =>
                router.push({
                  pathname: "/player/[id]",
                  params: { id: String(item.id) },
                })
              }
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Belum ada pemain favorit. Tekan ikon hati di kartu pemain untuk menambahkannya.
            </Text>
          }
        />
      )}

      <Pressable
        style={[styles.primaryButton, { marginRight: 0 }]}
        onPress={handleBack}
      >
        <Text style={styles.primaryButtonText}>Kembali</Text>
      </Pressable>
    </View>
  );
}
