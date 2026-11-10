import { ApiResponse } from "../types/api";

// ===== API BASE SERVICE (Modul 3: .then(), resolve, reject) =====

/**
 * Custom Promise-based HTTP Client:
 * Mengimplementasikan:
 * 1. Promise Constructor: new Promise(executor)
 * 2. Argumen executor: resolve() dan reject()
 * 3. Promise chaining method: .then() dan .catch()
 */
export function requestApi<T>(url: string): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    // pre-built async function: fetch()
    fetch(url)
      .then((response) => {
        // Cek status HTTP dari server
        if (!response.ok) {
          // Panggil reject() jika response server bukan 2xx (misal 404, 500)
          reject(
            new Error(
              `Request gagal dengan status HTTP ${response.status} (${response.statusText})`
            )
          );
        } else {
          // Parsing response stream menjadi JSON (mengembalikan Promise baru)
          return response.json();
        }
      })
      .then((responseData: any) => {
        // Jika data berhasil diurai, panggil resolve() dengan format ApiResponse<T>
        resolve({
          success: true,
          data: responseData as T,
          message: "Data berhasil diambil dari external API",
        });
      })
      .catch((error: Error) => {
        // Tangani kesalahan jaringan / network failure dengan reject()
        reject(
          new Error(
            error.message || "Terjadi kesalahan saat berkomunikasi dengan server"
          )
        );
      });
  });
}

