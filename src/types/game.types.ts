export type GameStatus = 'upcoming' | 'live' | 'finished';
export type GameName = 'CS2' | 'League of Legends' | 'Dota 2' | 'Valorant' | 'Overwatch' | 'Call of Duty';

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
