'use server';

import { getServerToken, getServerUser } from '@/lib/auth/server-token-storage';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * Get authenticated user on server-side
 * Use in Server Components or Server Actions
 */
export async function getAuthUser() {
    const token = await getServerToken();

    if (!token) {
        return null;
    }

    // Verify token is valid
    const payload = verifyToken(token);

    if (!payload) {
        return null;
    }

    // Get user data from cookie
    const user = await getServerUser(token);

    return user;
}

/**
 * Require authentication on server-side
 * Throws error if not authenticated
 */
export async function requireAuth() {
    const user = await getAuthUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    return user;
}

/**
 * Get JWT token on server-side
 */
export async function getAuthToken() {
    return await getServerToken();
}
