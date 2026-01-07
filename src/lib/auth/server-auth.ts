'use server';

import { getServerToken, getServerUser } from '@/lib/auth/server-token-storage';
import { verifyToken } from '@/lib/auth/jwt';
import { cache } from 'react';

/**
 * Get authenticated user on server-side
 * Use in Server Components or Server Actions
 */
export const getAuthUser = cache(async () => {
    const token = await getValidServerToken();

    if (!token) {
        return null;
    }

    // Get user data from API
    const user = await getServerUser(token);

    return user;
});

/**
 * Get valid JWT token on server-side.
 * Returns null if token is invalid
 */
export const getValidServerToken = async () => {
    const token = await getServerToken();

    if (!token) {
        return null;
    }

    // Verify token is valid
    const payload = verifyToken(token);

    if (!payload) {
        return null;
    }

    return token;
};

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
