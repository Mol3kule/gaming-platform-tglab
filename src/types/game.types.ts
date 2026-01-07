export type GameStatus = 'upcoming' | 'live' | 'finished';

export const GAME_NAMES = ['CS2', 'League of Legends', 'Dota 2', 'Valorant', 'Overwatch', 'Call of Duty'] as const;

export type GameName = (typeof GAME_NAMES)[number];

export type Team = {
    id: string;
    name: string;
    logo: string;
};

export type Odds = {
    homeWin: number;
    draw?: number;
    awayWin: number;
};

export type Game = {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    odds: Odds;
    status: GameStatus;
    startTime: Date;
    game: GameName;
    tournament?: string;
};
