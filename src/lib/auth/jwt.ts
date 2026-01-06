import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'prod-key';
const JWT_EXPIRES_IN = 3600 * 24 * 7;

export interface JWTPayload {
    userId: string;
    email: string;
    name: string;
}

/**
 * Generate JWT token for authenticated user
 * @param payload - User data to encode in token
 * @returns Signed JWT token
 */
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'gaming-platform',
    });
}

/**
 * Verify and decode JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: 'gaming-platform',
        }) as JWTPayload;

        return decoded;
    } catch {
        return null;
    }
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    return authHeader.replace('Bearer ', '');
}
