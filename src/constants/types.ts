// ===== TYPE & INTERFACE (Modul 1 - 5.5 B) =====

// Union type: nilainya hanya boleh salah satu dari pilihan ini
export type Role =
  | "Tank"
  | "Fighter"
  | "Assassin"
  | "Mage"
  | "Marksman"
  | "Support";

export type Rank = "Epic" | "Legend" | "Mythic" | "Mythical Glory";

// Interface: bentuk/struktur objek pemain
export interface Player {
  readonly id: string | number; // readonly: tidak bisa diubah setelah dibuat
  name: string;
  team: string;
  role: Role;
  mainHero: string;
  rank: Rank;
  matches: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  badge?: string; // opsional (tanda "?")
}

// Interface untuk kotak ringkasan di bagian atas
export interface SummaryItem {
  id: string;
  label: string;
  value: string;
  icon: "people" | "game-controller" | "skull" | "trophy";
}
