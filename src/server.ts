import 'dotenv/config'; // Load .env file

import next from 'next';
import express from 'express';
import { createServer } from 'http';
import { faker } from '@faker-js/faker';
import { Player } from './types/player.types';
import { generateToken, extractTokenFromHeader } from './lib/auth/jwt';
import { hashPassword, comparePassword } from './lib/auth/password';
import { authMiddleware } from './middleware/auth.middleware';
import { GamesData } from './lib/gamesData';
import { Odds } from './types/game.types';

import { Server as SocketIOServer, Socket } from 'socket.io';

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
            accessToken: null,
            bets: [],
            transactions: [],
            socketId: null,
        },
    ];

    const games = GamesData;

    const httpServer = createServer(server);

    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: [process.env.SOCKET_URL!],
            credentials: true,
        },
    });

    io.on('connection', (socket: Socket) => {
        const cookies = socket.handshake.headers.cookie;
        let authToken: string | null = null;

        if (cookies) {
            const cookieArray = cookies.split(';').map((cookie) => cookie.trim());
            const authCookie = cookieArray.find((cookie) => cookie.startsWith('auth_token='));
            if (authCookie) {
                authToken = authCookie.split('=')[1];
            }
        }

        // Find player by token and store socket ID
        if (authToken) {
            const player = players.find((p) => p.accessToken === authToken);
            if (player) {
                player.socketId = socket.id;
                console.log(`Player ${player.name} connected with socket ID: ${socket.id}`);
            }
        }

        socket.on('disconnect', () => {
            // Remove socket ID from player on disconnect
            if (authToken) {
                const player = players.find((p) => p.accessToken === authToken);
                if (player) {
                    player.socketId = null;
                    console.log(`Player ${player.name} disconnected`);
                }
            }
            console.log(socket.id, 'disconnected from socket.io server');
        });
    });

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
            socketId: null,
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
        const { gameId, amount, homeOrAway }: { gameId: string; amount: number; homeOrAway: keyof Odds } = req.body;

        const player = players.find(
            (player) => player.accessToken === extractTokenFromHeader(req.headers.authorization),
        )!;

        if (player.balance < amount) return res.status(400).json({ message: 'betting.insufficientFunds' });

        if (amount < 1) return res.status(400).json({ message: 'betting.minimumBet', currency: player.currency });

        const game = games.find((game) => game.id === gameId);

        if (!game) return res.status(404).json({ message: 'emptyState.notFound' });

        if (game.status === 'finished') return res.status(400).json({ message: 'betting.gameFinished' });

        if (player.bets.find((bet) => bet.gameId === gameId && bet.status === 'pending')) {
            return res.status(400).json({ message: 'betting.pendingBetExists' });
        }

        // Simulate game outcome with proper probabilities
        const random = Math.random();
        let gameOutcome: keyof Odds;

        const oddValue = game.odds[homeOrAway];
        if (oddValue === undefined) {
            return res.status(400).json({ message: 'betting.invalidSelection' });
        }

        if (game.odds.draw !== undefined) {
            // Three-way outcome (homeWin, draw, awayWin)
            if (random < 0.33) {
                gameOutcome = 'homeWin';
            } else if (random < 0.66) {
                gameOutcome = 'draw';
            } else {
                gameOutcome = 'awayWin';
            }
        } else {
            // Two-way outcome (homeWin, awayWin)
            gameOutcome = random < 0.5 ? 'homeWin' : 'awayWin';
        }

        player.balance = player.balance - amount;
        const betTransactionId = faker.string.uuid();

        if (game.status === 'live') {
            const isWin = gameOutcome === homeOrAway;

            if (isWin) {
                const winAmount = amount * oddValue;
                player.balance = player.balance + winAmount;

                player.transactions.push({
                    id: betTransactionId,
                    amount,
                    type: 'bet',
                    createdAt: Date.now(),
                });

                player.transactions.push({
                    id: faker.string.uuid(),
                    amount: winAmount,
                    type: 'win',
                    createdAt: Date.now(),
                });

                player.bets.push({
                    id: betTransactionId,
                    amount,
                    status: 'win',
                    createdAt: Date.now(),
                    winAmount,
                    gameId,
                });
            } else {
                player.transactions.push({
                    id: betTransactionId,
                    amount,
                    type: 'bet',
                    createdAt: Date.now(),
                });

                player.bets.push({
                    id: betTransactionId,
                    amount,
                    status: 'lost',
                    createdAt: Date.now(),
                    winAmount: null,
                    gameId,
                });
            }

            game.status = 'finished';

            if (player.socketId) {
                const socket = io.sockets.sockets.get(player.socketId);
                socket?.emit('updateBalance', { balance: player.balance });
            }

            res.json({
                transactionId: betTransactionId,
                currency: player.currency,
                balance: player.balance,
                winAmount: isWin ? amount * oddValue : null,
                status: 'live',
            });
        } else if (game.status === 'upcoming') {
            player.transactions.push({
                id: betTransactionId,
                amount,
                type: 'bet',
                createdAt: Date.now(),
            });

            player.bets.push({
                id: betTransactionId,
                amount,
                status: 'pending',
                createdAt: Date.now(),
                winAmount: null,
                gameId,
            });

            if (player.socketId) {
                const socket = io.sockets.sockets.get(player.socketId);
                socket?.emit('updateBalance', { balance: player.balance });
            }

            res.json({
                transactionId: betTransactionId,
                currency: player.currency,
                balance: player.balance,
                winAmount: null,
                status: 'upcoming',
            });
        }
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

        // Find the associated game
        const game = games.find((game) => game.id === bet.gameId);

        if (!game) return res.status(404).json({ message: 'Game not found' });

        // Only allow cancellation if the game is still upcoming
        if (game.status !== 'upcoming') {
            return res.status(400).json({ message: 'Can only cancel bets for upcoming games' });
        }

        // Only allow cancellation of pending bets
        if (bet.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot cancel completed bet' });
        }

        player.balance += bet.amount;
        bet.status = 'canceled';

        player.transactions.push({
            id: faker.string.uuid(),
            amount: bet.amount,
            type: 'cancel',
            createdAt: Date.now(),
        });

        // Emit balance update to the connected socket
        if (player.socketId) {
            io.to(player.socketId).emit('updateBalance', { balance: player.balance });
        }

        res.json({
            transactionId: id,
            balance: player.balance,
            currency: player.currency,
        });
    });

    server.get('/api/my-transactions', authMiddleware, (req, res) => {
        const { id, type, page, limit } = req.query;

        console.log(`Transaction type: ${type}`);
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

    server.post('/api/logout', authMiddleware, (req, res) => {
        const player = players.find(
            (player) => player.accessToken === extractTokenFromHeader(req.headers.authorization),
        )!;

        player.accessToken = null;

        res.clearCookie('auth_token');

        res.json({ message: 'Logged out successfully' });
    });

    // Let Next.js handle all other routes
    server.all(/.*/, (req, res) => handle(req, res));

    httpServer.listen(port, () => {
        console.log(`🚀 Server ready on http://localhost:${port}`);
    });
});
