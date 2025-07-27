import prisma from '@/lib/prisma';
import BanView from './BanView';
import Link from 'next/link';

async function getBans() {
    return prisma.ban.findMany({
        orderBy: { created_at: 'desc' },
    });
}

export default async function BanPage() {
    const bans = await getBans();

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-black p-4 border-b border-gray-700">
                <div className="container mx-auto">
                    <Link href="/admin" className="text-blue-400 hover:underline">&larr; Back to Dashboard</Link>
                    <h1 className="text-xl font-bold mt-2">Manage Bans</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-8">
                <BanView initialBans={bans} />
            </main>
        </div>
    );
}