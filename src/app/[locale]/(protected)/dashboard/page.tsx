import { getAuthUser } from '@/lib/auth/server-auth';
import { redirect } from 'next/navigation';

export default async function DasboardPage() {
    const user = await getAuthUser();

    if (!user) {
        redirect('/');
    }

    return (
        <div className="flex justify-center py-4">
            <div className="container">Dashboard Page for {user.name}</div>
        </div>
    );
}
