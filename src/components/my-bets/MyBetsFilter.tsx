'use client';

import { BetStatus } from '@/types/player.types';
import { useTranslations } from 'next-intl';
import { RenderAdditionalFilter } from '../filters/render-additional-filter';

const BET_STATUSES: BetStatus[] = ['pending', 'win', 'lost', 'canceled'];

interface MyBetsFilterProps {
    isMobile?: boolean;
}

export const MyBetsFilter = ({ isMobile = false }: MyBetsFilterProps) => {
    const t = useTranslations('my-bets');

    const statusOptions: { value: BetStatus | 'all'; label: string }[] = [
        { value: 'all', label: t('filter.allStatus') },
        ...BET_STATUSES.map((s) => ({ value: s, label: t(`status.${s}`) })),
    ];

    return <RenderAdditionalFilter filter="status" options={statusOptions} isMobile={isMobile} />;
};
