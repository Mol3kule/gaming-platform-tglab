import { Currency } from '@/types/player.types';

export const getCurrencySymbol = (currency: Currency): string => {
    const symbols: Record<Currency, string> = {
        EUR: '€',
        USD: '$',
    };

    return symbols[currency] || currency;
};
