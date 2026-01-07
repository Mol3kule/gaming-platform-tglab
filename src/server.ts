import 'dotenv/config'; // Load .env file

import next from 'next';
import express from 'express';
import { createServer } from 'http';
import { faker } from '@faker-js/faker';
import { Currency, Player } from './types/player.types';
import { generateToken, extractTokenFromHeader } from './lib/auth/jwt';
import { hashPassword, comparePassword } from './lib/auth/password';
import { authMiddleware } from './middleware/auth.middleware';
import { GamesData } from './lib/gamesData';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(async () => {
    const server = express();
    const players: Player[] = [
        {
            id: faker.string.uuid(),
            name: 'Test',
            email: 'test@gmail.com',
            password: await hashPassword('test123'),
            balance: 1000,
            currency: 'EUR',
            accessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmIzMjU1My01ZDMyLTQxMTMtYTI0YS04MmI4NDkzODMwODEiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwibmFtZSI6IlRlc3QiLCJpYXQiOjE3Njc3MzA0MTQsImV4cCI6MTc2ODMzNTIxNCwiaXNzIjoiZ2FtaW5nLXBsYXRmb3JtIn0.aP8CqzOcP_UNElyVNmxWIy7XFOpRHhGaGhZPKh4Y4H8',
            bets: [],
            transactions: [],
        },
    ];

    const currencyRates: Record<Currency, number> = {
        EUR: 1,
        USD: 0.86,
    };

    const games = GamesData;

    const httpServer = createServer(server);

    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    server.post('/api/register', async (req, res) => {
        const { username, email, password } = req.body;
        const id = faker.string.uuid();

        if (players.find((player) => player.email === email))
            return res.status(400).json({ message: 'register.errors.emailExists' });

        const hashedPassword = await hashPassword(password);
        players.push({
            id,
            name: username,
            email,
            password: hashedPassword,
            balance: 1000,
            currency: 'EUR',
            accessToken: null,
            bets: [],
            transactions: [],
        });

        res.json({
            id,
            name: username,
        });
    });

    server.post('/api/login', async (req, res) => {
        const { email, password } = req.body;

        const player = players.find((player) => player.email === email);

        if (!player) {
            return res.status(400).json({ message: 'login.errors.invalidCredentials' });
        }

        const isPasswordValid = await comparePassword(password, player.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'login.errors.invalidCredentials' });
        }

        // Generate JWT token
        const accessToken = generateToken({
            userId: player.id,
            email: player.email,
            name: player.name,
        });

        player.accessToken = accessToken;

        res.cookie('auth_token', accessToken);

        res.json({
            id: player.id,
            name: player.name,
            balance: player.balance,
            currency: player.currency,
            accessToken,
        });
    });

    server.post('/api/bet', authMiddleware, (req, res) => {
        const { amount } = req.body;

        const player = players.find(
            (player) => player.accessToken === extractTokenFromHeader(req.headers.authorization),
        )!;

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

    server.get('/api/my-bets', authMiddleware, (req, res) => {
        const { id, status, page, limit } = req.query;

        if (!page || !limit) return res.status(400).json({ message: 'Invalid parameters' });

        const player = players.find(
            (player) => player.accessToken === extractTokenFromHeader(req.headers.authorization),
        )!;

        if (!player) return res.status(401).json({ message: 'auth.errors.invalidToken' });

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

    server.delete('/api/my-bet/:id', authMiddleware, (req, res) => {
        const { id } = req.params;

        const player = players.find(
            (player) => player.accessToken === extractTokenFromHeader(req.headers.authorization),
        )!;

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

    server.get('/api/my-transactions', authMiddleware, (req, res) => {
        const { id, type, page, limit } = req.query;

        if (!page || !limit) return res.status(400).json({ message: 'Invalid parameters' });

        const player = players.find(
            (player) => player.accessToken === extractTokenFromHeader(req.headers.authorization),
        )!;

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

    server.get('/api/games', authMiddleware, (req, res) => {
        const { type, page, limit, status } = req.query;

        if (!page || !limit) return res.status(400).json({ message: 'Invalid parameters' });

        const total = games.length;
        const data = games
            .filter((game) => (type ? game.game === type : true))
            .filter((game) => (status ? game.status === status : true))
            .slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));

        res.json({
            data,
            total,
            page: Number(page),
            limit: Number(limit),
        });
    });

    server.get('/api/games/:id', authMiddleware, (req, res) => {
        const { id } = req.params;

        const game = games.find((g) => g.id === id);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.json(game);
    });

    server.get('/api/me', authMiddleware, (req, res) => {
        const player = players.find(
            (player) => player.accessToken === extractTokenFromHeader(req.headers.authorization),
        )!;

        res.json({
            id: player.id,
            name: player.name,
            balance: player.balance,
            currency: player.currency,
        });
    });

    // Let Next.js handle all other routes
    server.all(/.*/, (req, res) => handle(req, res));

    httpServer.listen(port, () => {
        console.log(`🚀 Server ready on http://localhost:${port}`);
    });
});
