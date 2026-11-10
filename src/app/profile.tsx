import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Loading from "../components/Loading";
import { styles } from "../constants/styles";
import { Player } from "../constants/types";
import { useFavorites } from "../context/FavoritesContext";
import { getPlayersFromApi } from "../services/playerService";
import { filterPlayers } from "../utils/helpers";

// Halaman Profile (normal page): app/profile.tsx -> /profile
export default function Profile() {
  const router = useRouter();
  const { favorites } = useFavorites();

  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  const favNames: string = filterPlayers(allPlayers, (p) =>
    favorites.includes(p.id)
  )
    .map((p) => p.name)
    .join(", ");

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailName}>Profil Saya</Text>

      {loading ? (
        <Loading message="Memuat info profil..." />
      ) : (
        <>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Aplikasi</Text>
            <Text style={styles.infoValue}>MLBB Stats Hub</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Jumlah Favorit</Text>
            <Text style={styles.infoValue}>{favorites.length}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pemain Favorit</Text>
            <Text style={styles.infoValue}>
              {favNames === "" ? "Belum ada pemain favorit" : favNames}
            </Text>
          </View>
        </>
      )}

      {/* Navigasi dengan komponen Link (Modul 2 - 3.1) */}
      <Link
        href="/favorites"
        style={{ color: "#facc15", marginTop: 20, fontSize: 15 }}
      >
        Lihat Daftar Favorit
      </Link>

      {/* Navigasi dengan router.push() (Modul 2 - 3.2 A) */}
      <Pressable
        style={[
          styles.primaryButton,
          { marginTop: 20, marginRight: 0, flex: 0 },
        ]}
        onPress={() => router.push("/")}
      >
        <Text style={styles.primaryButtonText}>Ke Home</Text>
      </Pressable>
    </View>
  );
}
