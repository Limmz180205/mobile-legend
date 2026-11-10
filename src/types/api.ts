// ===== INTERFACE API (Modul 3: Asynchronous & API Call) =====

// Generic interface untuk standarisasi response dari API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// Interface representasi data hero/player dari External API
export interface ApiHero {
  id: number | string;
  name: string;
  team?: string;
  role: string;
  mainHero?: string;
  rank?: string;
  matches?: number;
  wins?: number;
  kills?: number;
  deaths?: number;
  assists?: number;
  badge?: string;
  winRate?: number;
}

