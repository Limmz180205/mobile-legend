// ===== FAVORITE SERVICE (Modul 3: Async Service & Promise) =====

// Simulasi penyimpanan favorit persisten
let storedFavorites: (string | number)[] = ["1", "4"];

export const favoriteService = {
  /**
   * Mengambil seluruh ID favorit secara asynchronous
   */
  getFavorites: (): Promise<(string | number)[]> => {
    return new Promise((resolve) => {
      resolve([...storedFavorites]);
    });
  },

  /**
   * Menambah atau menghapus player dari daftar favorit
   * Menggunakan resolve saat berhasil dan reject jika ID tidak valid
   */
  toggleFavorite: (id: string | number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!id) {
        reject(new Error("ID player tidak valid"));
        return;
      }

      const index = storedFavorites.indexOf(id);
      let isNowFavorite = false;

      if (index > -1) {
        storedFavorites.splice(index, 1);
        isNowFavorite = false;
      } else {
        storedFavorites.push(id);
        isNowFavorite = true;
      }

      resolve(isNowFavorite);
    });
  },

  /**
   * Mengecek apakah player ada di daftar favorit
   */
  checkIsFavorite: (id: string | number): Promise<boolean> => {
    return new Promise((resolve) => {
      resolve(storedFavorites.includes(id));
    });
  },
};

