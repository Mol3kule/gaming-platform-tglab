import { SafeUser } from '@/types/player.types';
import axios from 'axios';
import { cookies } from 'next/headers';

const TOKEN_COOKIE_NAME = 'auth_token';

/**
 * Get JWT token from HTTP-only cookie (server-side)
 */
export async function getServerToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME);
    return token?.value || null;
}

/**
 * Get user data from cookie (server-side)
 */
export async function getServerUser(token: string): Promise<SafeUser | null> {
    try {
        const response = await axios.get(`${process.env.API_BASE_URL}/api/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data) {
            return null;
        }

        return response.data as SafeUser;
    } catch {
        return null;
    }
}

/**
 * Clear auth cookies (server-side)
 */
export async function clearServerAuth(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_COOKIE_NAME);
}
