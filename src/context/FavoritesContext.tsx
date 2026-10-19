import { createContext, ReactNode, useContext, useState } from "react";
import { FavoritesContextType } from "../constants/types";

// ===== useContext (Modul 2 - 2.4) =====
// 1. createContext: bikin "wadah" data. Nilai default null = belum ada Provider.
const FavoritesContext = createContext<FavoritesContextType | null>(null);

// 2. Provider: membungkus layar, semua child bisa mengakses value-nya
//    tanpa prop drilling (index, detail, dan favorites memakai data yang sama).
export function FavoritesProvider({ children }: { children: ReactNode }) {
    // useState: daftar id favorit. Kalau berubah, layar yang memakainya re-render.
    const [favorites, setFavorites] = useState<(string | number)[]>([]);

    const toggleFavorite = (id: string | number) => {
        if (favorites.includes(id)) {
            setFavorites(favorites.filter((f) => f !== id));
        } else {
            setFavorites([...favorites, id]);
        }
    };

    const isFavorite = (id: string | number): boolean => favorites.includes(id);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

// 3. Custom hook: pembungkus useContext supaya pemakaian di layar lebih ringkas
export function useFavorites(): FavoritesContextType {
    const ctx = useContext(FavoritesContext);
    if (ctx === null) {
        throw new Error("useFavorites harus dipakai di dalam FavoritesProvider");
    }
    return ctx;
}
