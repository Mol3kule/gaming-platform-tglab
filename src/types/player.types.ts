import { Expand } from './generic.types';

export type Currency = 'EUR' | 'USD';
export type TransactionType = 'win' | 'cancel' | 'bet';
export type BetStatus = 'win' | 'lost' | 'canceled';

export type Player = {
    id: string;
    name: string;
    email: string;
    password: string;
    balance: number;
    currency: Currency;
    accessToken: string | null;
    bets: Bet[];
    transactions: Transaction[];
};

export type SafeUser = Expand<Omit<Player, 'password' | 'accessToken' | 'bets' | 'transactions' | 'email'>>;

export type Transaction = {
    id: string;
    amount: number;
    type: TransactionType;
    createdAt: number;
};

export type Bet = Expand<
    {
        status: BetStatus;
        winAmount: number | null;
    } & Omit<Transaction, 'type'>
>;
