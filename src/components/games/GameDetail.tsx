'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Game } from '@/types/game.types';
import { useGetGameById } from '@/hooks/games/useGetGameById';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useTranslations, _Translator } from 'next-intl';
import { SafeUser } from '@/types/player.types';
import { useGameBet } from '@/hooks/games/useGameBet';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useCancelBet } from '@/hooks/my-bets/useCancelBet';
import { useGetMyBets } from '@/hooks/my-bets/useGetMyBets';

type GameDetailProps = {
    gameId: string;
    user: SafeUser;
};

const StatusBadge = ({ status, t }: { status: Game['status']; t: _Translator }) => {
    const statusStyles = {
        upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        live: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 animate-pulse',
        finished: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    };

    return (
        <span className={`px-3 py-1.5 text-sm font-bold rounded-full ${statusStyles[status]}`}>
            {t(`detail.status.${status}`)}
        </span>
    );
};

const BettingOption = ({
    teamName,
    odds,
    betType,
    onSelect,
    isSelected,
    disabled,
    t,
}: {
    teamName: string;
    odds: number;
    betType: 'homeWin' | 'draw' | 'awayWin';
    onSelect: (betType: 'homeWin' | 'draw' | 'awayWin') => void;
    isSelected: boolean;
    disabled: boolean;
    t: _Translator;
}) => (
    <Card
        className={`p-6 cursor-pointer transition-all border-2 ${
            isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 hover:bg-accent/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && onSelect(betType)}
    >
        <div className="flex flex-col gap-3 items-center">
            <span className="font-bold text-lg">{teamName}</span>
            <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{t('detail.odds')}</span>
                <span className="text-3xl font-black text-primary">{odds.toFixed(2)}</span>
            </div>
        </div>
    </Card>
);

export const GameDetail = ({ gameId, user }: GameDetailProps) => {
    const router = useRouter();
    const { data: game, isLoading } = useGetGameById(gameId);
    const [selectedBet, setSelectedBet] = useState<'homeWin' | 'draw' | 'awayWin' | null>(null);
    const [betAmount, setBetAmount] = useState<string>('');
    const [placedBetId, setPlacedBetId] = useState<string | null>(null);

    const t = useTranslations('games');
    const queryClient = useQueryClient();

    const { mutateAsync: mutateGameBetAsync, isPending: isPlacingBet } = useGameBet();
    const { mutate: cancelBet, isPending: isCancelingBet } = useCancelBet();
    const { data: myBets } = useGetMyBets({ page: 1, limit: 100, status: 'pending' });

    // Check for pending bets for this game on mount and when bets change
    useEffect(() => {
        if (myBets?.data?.data) {
            const pendingBet = myBets.data.data.find((bet) => bet.gameId === gameId && bet.status === 'pending');
            if (pendingBet) {
                setPlacedBetId(pendingBet.id);
            }
        }
    }, [myBets, gameId]);

    const handlePlaceBet = async () => {
        if (!selectedBet || !betAmount || parseFloat(betAmount) < 1) {
            return;
        }

        const response = await mutateGameBetAsync({
            gameId,
            amount: parseFloat(betAmount),
            homeOrAway: selectedBet,
        });

        if (!response) {
            toast.error(t('betting.betError'));
            return;
        }

        if (response.data.status === 'live' && response.data.winAmount !== null) {
            toast.success(t('betting.betWon', { amount: response.data.winAmount, currency: user.currency }));
            setPlacedBetId(null);
        } else if (response.data.status === 'live' && response.data.winAmount === null) {
            toast.error(t('betting.betLost'));
            setPlacedBetId(null);
        } else {
            toast.success(t('betting.betPlaced', { amount: betAmount, currency: user.currency }));
            setPlacedBetId(response.data.transactionId);
        }

        await queryClient.invalidateQueries({ queryKey: ['getGameById', gameId] });
        await queryClient.invalidateQueries({ queryKey: ['getGames'] });
    };

    const handleCancelBet = () => {
        if (!placedBetId) return;

        cancelBet(placedBetId, {
            onSuccess: () => {
                setPlacedBetId(null);
                setBetAmount('');
                setSelectedBet(null);
                queryClient.invalidateQueries({ queryKey: ['getGameById', gameId] });
            },
        });
    };

    const handleBetAmountChange = (value: number) => {
        if (value > user.balance) {
            setBetAmount(user.balance.toString());
        } else {
            setBetAmount(value.toString());
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-4xl">
                <div className="animate-pulse space-y-6">
                    <div className="h-12 bg-muted rounded" />
                    <div className="h-64 bg-muted rounded" />
                    <div className="h-96 bg-muted rounded" />
                </div>
            </div>
        );
    }

    if (!game || !game.data) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-4xl">
                <Card className="p-12 text-center">
                    <h2 className="text-2xl font-bold mb-4">{t('emptyState.notFound')}</h2>
                    <Button onClick={() => router.push('/games')}>{t('emptyState.backToGames')}</Button>
                </Card>
            </div>
        );
    }

    const isFinished = game.data.status === 'finished';
    const formattedTime = new Date(game.data.startTime).toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const potentialWinnings =
        selectedBet && betAmount ? (parseFloat(betAmount) * game.data.odds[selectedBet]!).toFixed(2) : '0.00';

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6 cursor-pointer">
                ← {t('backToGames')}
            </Button>

            <div className="space-y-8">
                <Card className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black">{game.data.game}</h1>
                            {game.data.tournament && (
                                <p className="text-lg text-muted-foreground">{game.data.tournament}</p>
                            )}
                            <p className="text-sm text-muted-foreground">{formattedTime}</p>
                        </div>
                        <StatusBadge status={game.data.status} t={t} />
                    </div>

                    <div className="flex items-center justify-around gap-8 py-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-32 h-32 relative bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex items-center justify-center">
                                <Image
                                    src={game.data.homeTeam.logo}
                                    alt={game.data.homeTeam.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-center">{game.data.homeTeam.name}</h2>
                        </div>

                        <div className="text-4xl font-black text-muted-foreground">VS</div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="w-32 h-32 relative bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex items-center justify-center">
                                <Image
                                    src={game.data.awayTeam.logo}
                                    alt={game.data.awayTeam.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-center">{game.data.awayTeam.name}</h2>
                        </div>
                    </div>
                </Card>

                {!isFinished && (
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold mb-6">{t('detail.placeYourBet')}</h2>

                        <div className="space-y-6">
                            <div>
                                <Label className="text-base mb-3 block">{t('detail.selectWinner')}</Label>
                                <div
                                    className={`grid gap-4 ${
                                        game.data.odds.draw !== undefined ? 'grid-cols-3' : 'grid-cols-2'
                                    }`}
                                >
                                    <BettingOption
                                        teamName={game.data.homeTeam.name}
                                        odds={game.data.odds.homeWin}
                                        betType="homeWin"
                                        onSelect={setSelectedBet}
                                        isSelected={selectedBet === 'homeWin'}
                                        disabled={isFinished}
                                        t={t}
                                    />
                                    {game.data.odds.draw !== undefined && (
                                        <BettingOption
                                            teamName={t('detail.draw')}
                                            odds={game.data.odds.draw}
                                            betType="draw"
                                            onSelect={setSelectedBet}
                                            isSelected={selectedBet === 'draw'}
                                            disabled={isFinished}
                                            t={t}
                                        />
                                    )}
                                    <BettingOption
                                        teamName={game.data.awayTeam.name}
                                        odds={game.data.odds.awayWin}
                                        betType="awayWin"
                                        onSelect={setSelectedBet}
                                        isSelected={selectedBet === 'awayWin'}
                                        disabled={isFinished}
                                        t={t}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="betAmount" className="text-base mb-2 block">
                                    {t('detail.betAmount', { currency: user.currency })}
                                </Label>
                                <Input
                                    id="betAmount"
                                    type="number"
                                    min="1"
                                    max={user.balance}
                                    step="1"
                                    value={betAmount}
                                    onChange={(e) => handleBetAmountChange(Number(e.target.value))}
                                    placeholder={t('detail.enterAmount')}
                                    className="text-lg"
                                />
                            </div>

                            {selectedBet && betAmount && parseFloat(betAmount) >= 1 && (
                                <Card className="p-4 bg-accent">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">{t('detail.potentialWinnings')}</span>
                                        <span className="text-2xl font-bold text-primary">
                                            {potentialWinnings} {user.currency}
                                        </span>
                                    </div>
                                </Card>
                            )}

                            <Button
                                onClick={handlePlaceBet}
                                disabled={
                                    !selectedBet ||
                                    !betAmount ||
                                    parseFloat(betAmount) < 1 ||
                                    isPlacingBet ||
                                    !!placedBetId
                                }
                                className="w-full text-lg py-6"
                                size="lg"
                            >
                                {isPlacingBet ? t('detail.placingBet') : t('detail.confirmBet')}
                            </Button>

                            {placedBetId && game.data.status === 'upcoming' && (
                                <Card className="p-4 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                                            {t('betting.pendingBetMessage')}
                                        </p>
                                        <Button
                                            onClick={handleCancelBet}
                                            disabled={isCancelingBet}
                                            variant="destructive"
                                            className="w-full"
                                        >
                                            {isCancelingBet ? t('betting.canceling') : t('betting.cancelBet')}
                                        </Button>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </Card>
                )}

                {isFinished && (
                    <Card className="p-8 text-center">
                        <h2 className="text-xl font-bold text-muted-foreground">{t('detail.bettingClosed')}</h2>
                    </Card>
                )}
            </div>
        </div>
    );
};
