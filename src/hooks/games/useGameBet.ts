'use client';

import { getValidServerToken } from '@/lib/auth/server-auth';
import { GameStatus, Odds } from '@/types/game.types';
import { Currency } from '@/types/player.types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

interface GameBetParams {
    gameId: string;
    amount: number;
    homeOrAway: keyof Odds;
}

interface GameBetResponse {
    transactionId: string;
    currency: Currency;
    balance: number;
    winAmount: number | null;
    status: GameStatus;
}

export const useGameBet = () => {
    return useMutation({
        mutationKey: ['placeGameBet'],
        mutationFn: async ({ gameId, amount, homeOrAway }: GameBetParams) => {
            try {
                const token = await getValidServerToken();

                if (!token) {
                    return null;
                }

                return (await axios.post(
                    '/api/bet',
                    { gameId, amount, homeOrAway },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )) as AxiosResponse<GameBetResponse>;
            } catch {
                return null;
            }
        },
    });
};
