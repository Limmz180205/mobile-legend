// ===== ASYNC UTILITY (Modul 3: Promise Constructor & setTimeout) =====

/**
 * Fungsi utility untuk menunda eksekusi kode (simulasi latensi jaringan / delay).
 * Mengembalikan objek Promise yang diselesaikan (resolve) setelah ms milidetik.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

