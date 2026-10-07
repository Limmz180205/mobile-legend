# MLBB Stats Hub — Aplikasi Statistik Pemain Mobile Legend

Tugas Pekan Demo — Pemrograman Mobile Modul 1 (Sintaks & UI Dasar), Lab Informatika UMM.

## Cara menjalankan

Salin folder `src/` ini ke project Expo hasil Modul 0 (ganti `src/app/index.tsx`), lalu:

```bash
npm install @expo/vector-icons   # biasanya sudah ada di template Expo
npx expo start --go
```

## Struktur

```
src/
├── app/index.tsx          # Layar utama (entry point)
├── constants/types.ts     # type Role/Rank + interface Player, SummaryItem
├── constants/styles.ts    # External styling (StyleSheet.create)
├── data/players.ts        # Array of Objects (manual + loop push)
└── utils/helpers.ts       # Custom function, conditions, switch, callback
```

## Pemetaan ke kriteria penilaian

| Kriteria | Lokasi |
|---|---|
| Custom Function & Loop | `helpers.ts` (getWinRate, getKDA, getGrade, filterPlayers); `index.tsx` (renderSummaryCard, renderPlayerCard, `summary.map()`, `for` loop chip role, `FlatList`); `players.ts` (`for` + `push`) |
| Type & Array of Objects | `types.ts` (union type, interface, `readonly`, properti opsional `?`); `players.ts` (`Player[]`) |
| Inline & External Styles | External: `constants/styles.ts`. Inline: chip role, warna grade, teks role di `index.tsx` |
| Materi lain | import `as` / `* as`, `Ionicons`, `Alert`, ternary, if/else, switch, callback, template literal |

## Fitur

- Ringkasan total pemain, match, kill, dan rata-rata win rate
- Cari pemain (TextInput) dan filter role (Pressable)
- Tap kartu = detail K/D/A, tambah favorit; tekan lama = Alert info
- Grade S/A/B/C dihitung dari win rate dan KDA

Catatan: `useState` dipakai untuk search/filter (dipelajari di modul berikutnya).
Data pemain bersifat fiktif untuk keperluan praktikum.
