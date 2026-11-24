import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Loading from "../components/Loading";
import { styles } from "../constants/styles";
import { Player } from "../constants/types";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { getPlayersFromApi } from "../services/playerService";
import { filterPlayers } from "../utils/helpers";

// ===== SCREEN: PROFIL SAYA (Modul 4: User Info & Sign Out Flow) =====
export default function Profile() {
  const router = useRouter();
  const { user, signOut, authActionLoading } = useAuth();
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

  const performSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      // Mengarahkan kembali ke halaman login (dan Route Guard juga akan memproteksi rute)
      router.replace("/login");
    }
  };

  const handleSignOut = () => {
    if (Platform.OS === "web") {
      const confirmed =
        typeof window !== "undefined"
          ? window.confirm("Apakah Anda yakin ingin keluar dari akun ini?")
          : true;
      if (confirmed) {
        performSignOut();
      }
    } else {
      Alert.alert(
        "Konfirmasi Keluar",
        "Apakah Anda yakin ingin keluar dari akun ini?",
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Keluar",
            style: "destructive",
            onPress: performSignOut,
          },
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.detailContainer}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#151c34",
            borderWidth: 2,
            borderColor: "#facc15",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <Ionicons name="person" size={40} color="#facc15" />
        </View>
        <Text style={styles.detailName}>Profil Pengguna</Text>

        {/* Badge Status Supabase Auth */}
        <View style={styles.authBadge}>
          <Ionicons name="checkmark-circle" size={14} color="#4ade80" />
          <Text style={styles.authBadgeText}>Terautentikasi (Supabase)</Text>
        </View>
      </View>

      {/* Informasi Akun Supabase */}
      <View style={[styles.card, { marginBottom: 16 }]}>
        <Text
          style={{
            color: "#facc15",
            fontSize: 15,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          <Ionicons name="shield" size={16} color="#facc15" /> Data Akun
        </Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email || "Tidak ada email"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>User ID</Text>
          <Text style={[styles.infoValue, { fontSize: 11, maxWidth: 200 }]} numberOfLines={1}>
            {user?.id || "-"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Terakhir Masuk</Text>
          <Text style={[styles.infoValue, { fontSize: 12 }]}>
            {user?.last_sign_in_at
              ? new Date(user.last_sign_in_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-"}
          </Text>
        </View>
      </View>

      {/* Statistik Aplikasi */}
      <View style={[styles.card, { marginBottom: 16 }]}>
        <Text
          style={{
            color: "#facc15",
            fontSize: 15,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          <Ionicons name="stats-chart" size={16} color="#facc15" /> Statistik Aplikasi
        </Text>
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
              <Text style={[styles.infoValue, { maxWidth: 200 }]} numberOfLines={2}>
                {favNames === "" ? "Belum ada pemain favorit" : favNames}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Navigasi Cepat */}
      <Link
        href="/favorites"
        style={{ color: "#facc15", marginTop: 8, fontSize: 15, textAlign: "center" }}
      >
        Lihat Daftar Favorit
      </Link>

      <View style={{ marginTop: 20, marginBottom: 40, gap: 12 }}>
        {/* Tombol ke Home */}
        <Pressable
          style={[
            styles.secondaryButton,
            { flexDirection: "row", gap: 6, flex: 0, paddingVertical: 14, cursor: "pointer" },
          ]}
          onPress={() => router.push("/")}
        >
          <Ionicons name="home-outline" size={18} color="#cbd5e1" />
          <Text style={styles.secondaryButtonText}>Kembali ke Home</Text>
        </Pressable>

        {/* Tombol Logout (Supabase Auth Flow: Sign Out) */}
        <Pressable
          style={[
            styles.primaryButton,
            {
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              borderColor: "#ef4444",
              borderWidth: 1,
              marginRight: 0,
              flex: 0,
              paddingVertical: 14,
              cursor: "pointer",
            },
          ]}
          onPress={handleSignOut}
          disabled={authActionLoading}
        >
          {authActionLoading ? (
            <ActivityIndicator color="#ef4444" size="small" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={18} color="#ef4444" />
              <Text style={[styles.primaryButtonText, { color: "#ef4444" }]}>
                Keluar (Sign Out)
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
