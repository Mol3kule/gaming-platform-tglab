'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Game } from '@/types/game.types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type GameCardProps = {
    game: Game;
};

const StatusBadge = ({ status }: { status: Game['status'] }) => {
    const t = useTranslations('games.statusOptions');

    const statusStyles = {
        upcoming: 'bg-blue-100 text-blue-800',
        live: 'bg-red-100 text-red-800 animate-pulse',
        finished: 'bg-gray-100 text-gray-800',
    };

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
            {t(status).toUpperCase()}
        </span>
    );
};

const TeamDisplay = ({ name, logo }: { name: string; logo: string }) => (
    <div className="flex flex-col items-center gap-2 flex-1">
        <div className="w-16 h-16 relative bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
            <Image src={logo} alt={name} fill className="object-cover" />
        </div>
        <span className="font-semibold text-center">{name}</span>
    </div>
);

const OddsButton = ({
    odds,
    label,
    onClick,
    disabled,
}: {
    odds: number;
    label: string;
    onClick?: (e: React.MouseEvent) => void;
    disabled: boolean;
}) => (
    <Button
        variant="outline"
        className="flex flex-col gap-1 h-auto py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
        onClick={onClick}
        disabled={disabled}
    >
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-lg font-bold">{odds.toFixed(2)}</span>
    </Button>
);

export const GameCard = ({ game }: GameCardProps) => {
    const router = useRouter();
    const isFinished = game.status === 'finished';
    const formattedTime = new Date(game.startTime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const handleCardClick = () => {
        router.push(`/games/${game.id}`);
    };

    return (
        <Card className="p-6 hover:shadow-lg transition-shadow select-none cursor-pointer" onClick={handleCardClick}>
            <div className="flex flex-col gap-4 h-full">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-primary">{game.game}</span>
                        {game.tournament && <span className="text-xs text-muted-foreground">{game.tournament}</span>}
                    </div>
                    <StatusBadge status={game.status} />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <TeamDisplay name={game.homeTeam.name} logo={game.homeTeam.logo} />

                    <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl font-bold">VS</span>
                        <span className="text-xs text-muted-foreground">{formattedTime}</span>
                    </div>

                    <TeamDisplay name={game.awayTeam.name} logo={game.awayTeam.logo} />
                </div>

                <div className={`flex flex-1 items-end`}>
                    <div
                        className={`w-full grid gap-2 ${game.odds.draw !== undefined ? 'grid-cols-3' : 'grid-cols-2'}`}
                    >
                        <OddsButton odds={game.odds.homeWin} label={game.homeTeam.name} disabled={isFinished} />
                        {game.odds.draw !== undefined && (
                            <OddsButton odds={game.odds.draw} label="Draw" disabled={isFinished} />
                        )}
                        <OddsButton odds={game.odds.awayWin} label={game.awayTeam.name} disabled={isFinished} />
                    </div>
                </div>
            </div>
        </Card>
    );
};
