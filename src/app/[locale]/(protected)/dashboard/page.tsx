import { getAuthUser } from '@/lib/auth/server-auth';
import { redirect } from 'next/navigation';

export default async function DasboardPage() {
    const user = await getAuthUser();

    if (!user) {
        redirect('/');
    }

    return <div>Dashboard Page</div>;
}
