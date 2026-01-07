import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';

/**
 * Middleware to verify JWT token and attach user to request
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = verifyToken(token);

    if (!payload) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    next();
}
