'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Game } from '@/types/game.types';
import { useGetGameById } from '@/hooks/games/useGetGameById';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

type GameDetailProps = {
    gameId: string;
    userName: string;
};

const StatusBadge = ({ status }: { status: Game['status'] }) => {
    const statusStyles = {
        upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        live: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 animate-pulse',
        finished: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    };

    return (
        <span className={`px-3 py-1.5 text-sm font-bold rounded-full ${statusStyles[status]}`}>
            {status.toUpperCase()}
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
}: {
    teamName: string;
    odds: number;
    betType: 'homeWin' | 'draw' | 'awayWin';
    onSelect: (betType: 'homeWin' | 'draw' | 'awayWin') => void;
    isSelected: boolean;
    disabled: boolean;
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
                <span className="text-xs text-muted-foreground">Odds</span>
                <span className="text-3xl font-black text-primary">{odds.toFixed(2)}</span>
            </div>
        </div>
    </Card>
);

export const GameDetail = ({ gameId, userName }: GameDetailProps) => {
    const router = useRouter();
    const { data: game, isLoading } = useGetGameById(gameId);
    const [selectedBet, setSelectedBet] = useState<'homeWin' | 'draw' | 'awayWin' | null>(null);
    const [betAmount, setBetAmount] = useState<string>('');
    const [isPlacingBet, setIsPlacingBet] = useState(false);

    const handlePlaceBet = async () => {
        if (!selectedBet || !betAmount || parseFloat(betAmount) <= 0) {
            return;
        }

        setIsPlacingBet(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Bet placed:', {
            gameId,
            betType: selectedBet,
            amount: parseFloat(betAmount),
        });

        setIsPlacingBet(false);
        router.push('/games');
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

    if (!game) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-4xl">
                <Card className="p-12 text-center">
                    <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
                    <p className="text-muted-foreground mb-6">The game youre looking for doesnt exist.</p>
                    <Button onClick={() => router.push('/games')}>Back to Games</Button>
                </Card>
            </div>
        );
    }

    const isFinished = game.status === 'finished';
    const formattedTime = new Date(game.startTime).toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const potentialWinnings =
        selectedBet && betAmount ? (parseFloat(betAmount) * game.odds[selectedBet]!).toFixed(2) : '0.00';

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <Button variant="ghost" onClick={() => router.push('/games')} className="mb-6">
                ← Back to Games
            </Button>

            <div className="space-y-8">
                <Card className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black">{game.game}</h1>
                            {game.tournament && <p className="text-lg text-muted-foreground">{game.tournament}</p>}
                            <p className="text-sm text-muted-foreground">{formattedTime}</p>
                        </div>
                        <StatusBadge status={game.status} />
                    </div>

                    <div className="flex items-center justify-around gap-8 py-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-32 h-32 relative bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex items-center justify-center">
                                <Image
                                    src={game.homeTeam.logo}
                                    alt={game.homeTeam.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-center">{game.homeTeam.name}</h2>
                        </div>

                        <div className="text-4xl font-black text-muted-foreground">VS</div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="w-32 h-32 relative bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex items-center justify-center">
                                <Image
                                    src={game.awayTeam.logo}
                                    alt={game.awayTeam.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-center">{game.awayTeam.name}</h2>
                        </div>
                    </div>
                </Card>

                {!isFinished && (
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold mb-6">Place Your Bet</h2>

                        <div className="space-y-6">
                            <div>
                                <Label className="text-base mb-3 block">Select Winner</Label>
                                <div
                                    className={`grid gap-4 ${
                                        game.odds.draw !== undefined ? 'grid-cols-3' : 'grid-cols-2'
                                    }`}
                                >
                                    <BettingOption
                                        teamName={game.homeTeam.name}
                                        odds={game.odds.homeWin}
                                        betType="homeWin"
                                        onSelect={setSelectedBet}
                                        isSelected={selectedBet === 'homeWin'}
                                        disabled={isFinished}
                                    />
                                    {game.odds.draw !== undefined && (
                                        <BettingOption
                                            teamName="Draw"
                                            odds={game.odds.draw}
                                            betType="draw"
                                            onSelect={setSelectedBet}
                                            isSelected={selectedBet === 'draw'}
                                            disabled={isFinished}
                                        />
                                    )}
                                    <BettingOption
                                        teamName={game.awayTeam.name}
                                        odds={game.odds.awayWin}
                                        betType="awayWin"
                                        onSelect={setSelectedBet}
                                        isSelected={selectedBet === 'awayWin'}
                                        disabled={isFinished}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="betAmount" className="text-base mb-2 block">
                                    Bet Amount ($)
                                </Label>
                                <Input
                                    id="betAmount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={betAmount}
                                    onChange={(e) => setBetAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="text-lg"
                                />
                            </div>

                            {selectedBet && betAmount && parseFloat(betAmount) > 0 && (
                                <Card className="p-4 bg-accent">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Potential Winnings:</span>
                                        <span className="text-2xl font-bold text-primary">${potentialWinnings}</span>
                                    </div>
                                </Card>
                            )}

                            <Button
                                onClick={handlePlaceBet}
                                disabled={!selectedBet || !betAmount || parseFloat(betAmount) <= 0 || isPlacingBet}
                                className="w-full text-lg py-6"
                                size="lg"
                            >
                                {isPlacingBet ? 'Placing Bet...' : 'Confirm Bet'}
                            </Button>
                        </div>
                    </Card>
                )}

                {isFinished && (
                    <Card className="p-8 text-center">
                        <h2 className="text-xl font-bold text-muted-foreground">
                            This game has finished. Betting is closed.
                        </h2>
                    </Card>
                )}
            </div>
        </div>
    );
};
