import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import Loading from "../components/Loading";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { FavoritesProvider } from "../context/FavoritesContext";

// ===== ROUTE PROTECTION GUARDS (Modul 4: Route Protection) =====
/**
 * Komponen pembungkus navigasi yang mengamati status autentikasi & rute saat ini.
 * Memastikan proteksi rute:
 * 1. Jika sesi belum tersedia (belum login), pengguna dialihkan ke rute /login.
 * 2. Jika sesi sudah tersedia (sudah login), pengguna yang berada di rute login/register
 *    dialihkan kembali ke halaman utama / (Home).
 * 3. Menampilkan indikator loading saat status sesi sedang diverifikasi dari SecureStore.
 */
function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Tunggu sampai inisialisasi session dari SecureStore selesai
    if (isLoading) return;

    // segments[0] mencerminkan segmen rute tingkat atas (misal: "login", "register", "search", dll)
    const currentSegment = segments[0];
    const inAuthRoute = currentSegment === "login" || currentSegment === "register";

    if (!session && !inAuthRoute) {
      // Belum login & mencoba membuka halaman yang diproteksi -> alihkan ke Login
      router.replace("/login");
    } else if (session && inAuthRoute) {
      // Sudah login & masih di halaman auth -> alihkan ke Home
      router.replace("/");
    }
  }, [session, isLoading, segments, router]);

  // Loading state saat membaca token dari Secure Token Storage
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0b1020",
        }}
      >
        <Loading message="Memeriksa sesi autentikasi..." />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0b1020" },
        headerTintColor: "#facc15",
        headerTitleStyle: { fontWeight: "bold" },
        contentStyle: { backgroundColor: "#0b1020" },
      }}
    >
      {/* Layar Utama (Protected) */}
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
      {/* Layar Autentikasi (Public) */}
      <Stack.Screen name="login" options={{ title: "Masuk", headerShown: false }} />
      <Stack.Screen name="register" options={{ title: "Daftar Akun", headerShown: false }} />
      {/* Layar Aplikasi Lainnya (Protected) */}
      <Stack.Screen name="search" options={{ title: "Cari Karakter" }} />
      <Stack.Screen name="player/[id]" options={{ title: "Detail Pemain" }} />
      <Stack.Screen name="favorites" options={{ title: "Pemain Favorit" }} />
      <Stack.Screen name="profile" options={{ title: "Profil Saya" }} />
      <Stack.Screen name="notes" options={{ title: "Catatan MLBB" }} />
    </Stack>
  );
}

// ===== ROOT LAYOUT =====
export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <RootLayoutNav />
      </FavoritesProvider>
    </AuthProvider>
  );
}
