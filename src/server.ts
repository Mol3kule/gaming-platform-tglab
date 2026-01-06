import next from 'next';
import express, { Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import { Player } from './types/player.types';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.SERVER_PORT || 3001;

app.prepare().then(() => {
    const server = express();

    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    const players: Player[] = [];

    server.post('/register', (req, res) => {
        const { name, email, password, confirmPassword } = req.body;
        const id = faker.string.uuid();

        if (players.find((player) => player.email === email))
            return res.status(400).json({ message: 'Email already registered' });

        if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

        players.push({
            id,
            name,
            email,
            password,
            balance: 1000,
            currency: 'EUR',
            accessToken: null,
            bets: [],
            transactions: [],
        });

        res.json({
            id,
            name,
        });
    });

    server.post('/bet', (req, res) => {
        const { amount } = req.body;
        const authorization = req.headers.authorization;

        if (!authorization) return res.status(401).json({ message: 'Invalid token' });

        const player = players.find((player) => player.accessToken === authorization.replace('Bearer ', ''));

        if (!player) return res.status(401).json({ message: 'Invalid token' });

        if (player.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

        if (amount < 1) return res.status(400).json({ message: 'Minimum bet amount is 1' });

        const isWin = Math.random() < 0.3;
        const betTransactionId = faker.string.uuid();

        player.balance = player.balance - amount;

        if (isWin) player.balance = player.balance + amount * 2;

        player.transactions.push({
            id: betTransactionId,
            amount,
            type: 'bet',
            createdAt: Date.now(),
        });

        if (isWin)
            player.transactions.push({
                id: faker.string.uuid(),
                amount: amount * 2,
                type: 'win',
                createdAt: Date.now(),
            });

        player.bets.push({
            id: betTransactionId,
            amount,
            status: isWin ? 'win' : 'lost',
            createdAt: Date.now(),
            winAmount: isWin ? amount * 2 : null,
        });

        res.json({
            transactionId: betTransactionId,
            currency: 'EUR',
            balance: player.balance,
            winAmount: isWin ? amount * 2 : null,
        });
    });

    server.get('/my-bets', (req, res) => {
        const { id, status, page, limit } = req.query;
        const authorization = req.headers.authorization;

        if (!authorization) return res.status(401).json({ message: 'Invalid token' });

        if (!page || !limit) return res.status(400).json({ message: 'Invalid parameters' });

        const player = players.find((player) => player.accessToken === authorization.replace('Bearer ', ''));

        if (!player) return res.status(401).json({ message: 'Invalid token' });

        const bets = player.bets
            .filter((bet) => (!id || bet.id === id) && (!status || bet.status === status) && bet)
            .sort((a, b) => b.createdAt - a.createdAt);

        const total = bets.length;
        const data = bets.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));

        res.json({
            data,
            total,
            page: Number(page),
            limit: Number(limit),
        });
    });

    server.delete('/my-bet/:id', (req, res) => {
        const { id } = req.params;
        const authorization = req.headers.authorization;

        if (!authorization) return res.status(401).json({ message: 'Invalid token' });

        const player = players.find((player) => player.accessToken === authorization.replace('Bearer ', ''));

        if (!player) return res.status(401).json({ message: 'Invalid token' });

        const bet = player.bets.find((bet) => bet.id === id);

        if (!bet) return res.status(404).json({ message: 'Bet not found' });

        if (bet.status === 'canceled') return res.status(400).json({ message: 'Bet already canceled' });

        if (bet.status === 'win' && player.balance < bet.amount)
            return res.status(400).json({ message: 'Bet already completed' });

        player.balance += bet.amount;
        bet.status = 'canceled';

        player.transactions.push({
            id: faker.string.uuid(),
            amount: bet.amount,
            type: 'cancel',
            createdAt: Date.now(),
        });

        res.json({
            transactionId: id,
            balance: player.balance,
            currency: player.currency,
        });
    });

    server.get('/my-transactions', (req, res) => {
        const { id, type, page, limit } = req.query;
        const authorization = req.headers.authorization;

        if (!authorization) return res.status(401).json({ message: 'Invalid token' });

        if (!page || !limit) return res.status(400).json({ message: 'Invalid parameters' });

        const player = players.find((player) => player.accessToken === authorization.replace('Bearer ', ''));

        if (!player) return res.status(401).json({ message: 'Invalid token' });

        const transactions = player.transactions
            .filter(
                (transaction) => (!id || transaction.id === id) && (!type || transaction.type === type) && transaction,
            )
            .sort((a, b) => b.createdAt - a.createdAt);

        const total = transactions.length;
        const data = transactions.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));

        res.json({
            data,
            total,
            page: Number(page),
            limit: Number(limit),
        });
    });

    // Let Next.js handle all other routes
    server.all('*', (req: Request, res: Response) => {
        return handle(req, res);
    });

    server.listen(port, () => {
        console.log(`🚀 Server ready on http://localhost:${port}`);
    });
});
