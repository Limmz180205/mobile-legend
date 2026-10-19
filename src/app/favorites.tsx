import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import PlayerCard from "../components/PlayerCard";
import { styles } from "../constants/styles";
import { Player } from "../constants/types";
import { useFavorites } from "../context/FavoritesContext";
import { players } from "../data/players";
import { filterPlayers } from "../utils/helpers";

// Halaman biasa (normal page): app/favorites.tsx -> /favorites
export default function Favorites() {
    const router = useRouter();
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    // Data yang sama dengan Home, hanya disaring lewat context (callback filterPlayers)
    const favPlayers: Player[] = filterPlayers(players, (p) => favorites.includes(p.id));

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/");
        }
    };

    return (
        <View style={styles.detailContainer}>
            <FlatList
                data={favPlayers}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <PlayerCard
                        player={item}
                        isFavorite={isFavorite(item.id)}
                        onPress={() =>
                            router.push({ pathname: "/player/[id]", params: { id: String(item.id) } })
                        }
                        onToggleFavorite={() => toggleFavorite(item.id)}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        Belum ada pemain favorit. Tekan ikon hati di kartu pemain.
                    </Text>
                }
            />

            <Pressable style={[styles.primaryButton, { marginRight: 0 }]} onPress={handleBack}>
                <Text style={styles.primaryButtonText}>Kembali</Text>
            </Pressable>
        </View>
    );
}
