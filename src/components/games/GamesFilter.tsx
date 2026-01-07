'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameStatus, GameName, GAME_NAMES } from '@/types/game.types';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

export const GamesFilter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [gameName, setGameName] = useState(searchParams.get('gameName') || '');
    const [status, setStatus] = useState<GameStatus | 'all'>((searchParams.get('status') as GameStatus) || 'all');
    const t = useTranslations('games');

    useEffect(() => {
        setGameName(decodeURIComponent(searchParams.get('gameName') || ''));
        setStatus((searchParams.get('status') as GameStatus) || 'all');
    }, [searchParams]);

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (gameName) {
            params.set('gameName', encodeURIComponent(gameName));
        } else {
            params.delete('gameName');
        }

        if (status !== 'all') {
            params.set('status', status);
        } else {
            params.delete('status');
        }

        if (gameName && status !== 'all') {
            params.set('page', '1');
        }

        router.push(`?${params.toString()}`);
    };

    const handleReset = () => {
        setGameName('');
        setStatus('all');

        const params = new URLSearchParams(searchParams.toString());
        params.delete('gameName');
        params.delete('status');

        if (params.has('page')) {
            params.set('page', '1');
        }

        router.push(`?${params.toString()}`);
    };

    const statusOptions: { value: GameStatus | 'all'; label: string }[] = [
        { value: 'all', label: t('filter.allStatus') },
        { value: 'live', label: t('filter.live') },
        { value: 'upcoming', label: t('filter.upcoming') },
    ];

    return (
        <Card className="w-full md:w-80 h-fit">
            <CardHeader>
                <CardTitle>{t('filter.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                    <Label>{t('filter.gameNameLabel')}</Label>
                    <RadioGroup
                        onValueChange={(value) => {
                            setGameName(value as GameName);
                        }}
                        value={gameName}
                    >
                        {GAME_NAMES.map((value, idx) => (
                            <div className="flex gap-2" key={`filters_name_${idx}`}>
                                <RadioGroupItem value={value} id={`filters_name_${idx}`} />
                                <Label htmlFor={`filters_name_${idx}`}>{value}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="flex flex-col gap-4">
                    <Label>{t('filter.statusLabel')}</Label>
                    <div className="flex flex-col gap-2">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setStatus(option.value)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    status === option.value
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button onClick={handleApplyFilters} className="flex-1">
                        {t('filter.apply')}
                    </Button>
                    <Button onClick={handleReset} variant="outline" className="flex-1">
                        {t('filter.reset')}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
