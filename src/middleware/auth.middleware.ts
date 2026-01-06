import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        name: string;
    };
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
        return res.status(401).json({ message: 'auth.errors.unauthorized' });
    }

    const payload = verifyToken(token);

    if (!payload) {
        return res.status(401).json({ message: 'auth.errors.invalidToken' });
    }

    // Attach user data to request
    req.user = payload;
    next();
}
