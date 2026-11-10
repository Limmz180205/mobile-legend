import { Stack } from "expo-router";
import { FavoritesProvider } from "../context/FavoritesContext";

// ===== ROOT LAYOUT (Expo Router Stack Navigator) =====
export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0b1020" },
          headerTintColor: "#facc15",
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: "#0b1020" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
        <Stack.Screen name="search" options={{ title: "Cari Karakter" }} />
        <Stack.Screen name="player/[id]" options={{ title: "Detail Pemain" }} />
        <Stack.Screen name="favorites" options={{ title: "Pemain Favorit" }} />
        <Stack.Screen name="profile" options={{ title: "Profil Saya" }} />
      </Stack>
    </FavoritesProvider>
  );
}
