type Player = {
    id: string;
    name: string;
    team: string;
    role: "Fighter" | "Marksman" | "Mage" | "Assassin" | "Tank" | "Support";
    mainHero: string;
    rank: string;
    matches: number;
    wins: number;
    kills: number;
    deaths: number;
    assists: number;
    badge?: string;
};

// ===== ARRAY OF OBJECTS (Modul 1 - 5.5 A) =====
// Data pemain dibuat manual (5 pemain) ...
const basePlayers: Player[] = [
    { id: "1", name: "Kairi", team: "Evos Legends", role: "Fighter", mainHero: "Paquito", rank: "Mythical Glory", matches: 420, wins: 276, kills: 3150, deaths: 1620, assists: 2480, badge: "MVP" },
    { id: "2", name: "Skylar", team: "RRQ Hoshi", role: "Marksman", mainHero: "Beatrix", rank: "Mythical Glory", matches: 515, wins: 340, kills: 4210, deaths: 1890, assists: 2920 },
    { id: "3", name: "Albert", team: "Alter Ego", role: "Mage", mainHero: "Kadita", rank: "Mythic", matches: 380, wins: 205, kills: 2870, deaths: 1710, assists: 3100 },
    { id: "4", name: "Clay", team: "Onic Esports", role: "Assassin", mainHero: "Fanny", rank: "Mythical Glory", matches: 460, wins: 301, kills: 4980, deaths: 2240, assists: 1760, badge: "Savage Master" },
    { id: "5", name: "Rinz", team: "Geek Fam", role: "Tank", mainHero: "Khufra", rank: "Legend", matches: 295, wins: 148, kills: 910, deaths: 1540, assists: 3890 },
];

// ... lalu ditambah memakai LOOP + push() (seperti materi Modul 1)
const heroes = ["Lancelot", "Gusion", "Estes", "Tigreal", "Granger"];
const roles: Player["role"][] = ["Assassin", "Assassin", "Support", "Tank", "Marksman"];
const teams = ["Bigetron", "Aura Fire", "Dewa United", "Todak", "Falcon"];

const generated: Player[] = [];
for (let i = 0; i < heroes.length; i++) {
    const matches = 200 + i * 37;
    generated.push({
        id: `g${i + 1}`,
        name: `Player${i + 6}`,
        team: teams[i],
        role: roles[i],
        mainHero: heroes[i],
        rank: i % 2 === 0 ? "Mythic" : "Legend",
        matches,
        wins: Math.round(matches * (0.48 + i * 0.03)),
        kills: 1500 + i * 420,
        deaths: 900 + i * 110,
        assists: 1200 + i * 380,
    });
}

export const players: Player[] = [...basePlayers, ...generated];
