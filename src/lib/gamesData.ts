import { Game } from '@/types/game.types';

export const GamesData: Game[] = [
    {
        id: '1',
        homeTeam: {
            id: 'team1',
            name: 'Team Liquid',
            logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop',
        },
        awayTeam: {
            id: 'team2',
            name: 'FaZe Clan',
            logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop',
        },
        odds: {
            homeWin: 1.75,
            awayWin: 2.1,
        },
        status: 'live',
        startTime: new Date(),
        game: 'CS2',
        tournament: 'ESL Pro League',
    },
    {
        id: '2',
        homeTeam: {
            id: 'team3',
            name: 'T1',
            logo: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&h=200&fit=crop',
        },
        awayTeam: {
            id: 'team4',
            name: 'Gen.G',
            logo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&h=200&fit=crop',
        },
        odds: {
            homeWin: 1.65,
            awayWin: 2.25,
        },
        status: 'live',
        startTime: new Date(),
        game: 'League of Legends',
        tournament: 'LCK Spring 2026',
    },
    {
        id: '3',
        homeTeam: {
            id: 'team5',
            name: 'OG',
            logo: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=200&fit=crop',
        },
        awayTeam: {
            id: 'team6',
            name: 'Team Spirit',
            logo: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&h=200&fit=crop',
        },
        odds: {
            homeWin: 2.2,
            awayWin: 1.7,
        },
        status: 'live',
        startTime: new Date(),
        game: 'Dota 2',
        tournament: 'DreamLeague',
    },
    {
        id: '4',
        homeTeam: {
            id: 'team7',
            name: 'Sentinels',
            logo: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=200&h=200&fit=crop',
        },
        awayTeam: {
            id: 'team8',
            name: 'Cloud9',
            logo: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=200&h=200&fit=crop',
        },
        odds: {
            homeWin: 1.9,
            awayWin: 1.9,
        },
        status: 'upcoming',
        startTime: new Date(Date.now() + 259200000),
        game: 'Valorant',
        tournament: 'VCT Americas',
    },
    {
        id: '5',
        homeTeam: {
            id: 'team9',
            name: 'G2 Esports',
            logo: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=200&h=200&fit=crop',
        },
        awayTeam: {
            id: 'team10',
            name: 'Fnatic',
            logo: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200&h=200&fit=crop',
        },
        odds: {
            homeWin: 2.05,
            awayWin: 1.8,
        },
        status: 'upcoming',
        startTime: new Date(Date.now() + 345600000),
        game: 'League of Legends',
        tournament: 'LEC Winter',
    },
    {
        id: '6',
        homeTeam: {
            id: 'team11',
            name: 'NAVI',
            logo: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&h=200&fit=crop',
        },
        awayTeam: {
            id: 'team12',
            name: 'Vitality',
            logo: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop',
        },
        odds: {
            homeWin: 1.55,
            awayWin: 2.5,
        },
        status: 'upcoming',
        startTime: new Date(Date.now() + 432000000),
        game: 'CS2',
        tournament: 'BLAST Premier',
    },
];
