import { Stack } from "expo-router";
import { FavoritesProvider } from "../context/FavoritesContext";

// ===== _layout.tsx + <Stack.Screen> (Modul 2 - 2.7 & 3.2) =====
// _layout.tsx = "pembungkus" semua halaman di folder app/.
// <Stack> = navigator bertumpuk: halaman baru muncul di atas halaman lama.
export default function RootLayout() {
  return (
    // Provider membungkus Stack, jadi SEMUA halaman bisa memakai useFavorites()
    <FavoritesProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0b1020" },
          headerTintColor: "#facc15",
          contentStyle: { backgroundColor: "#0b1020" },
        }}
      >
        {/* name = nama file/rute di dalam folder app */}
        <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
        <Stack.Screen name="player/[id]" options={{ title: "Detail Pemain" }} />
        <Stack.Screen name="favorites" options={{ title: "Pemain Favorit" }} />
      </Stack>
    </FavoritesProvider>
  );
}