import { getAuthUser } from '@/lib/auth/server-auth';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { RenderMyBetsDataTable } from './renderDataTable';

export default async function MyBetsPage() {
    const user = await getAuthUser();

    if (!user) {
        redirect('/');
    }

    const t = await getTranslations('my-bets');

    return (
        <div className="flex flex-col flex-1 p-3.5 gap-3.5">
            <div>
                <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
                <p className="text-muted-foreground">{t('description')}</p>
            </div>
            <RenderMyBetsDataTable />
        </div>
    );
}
