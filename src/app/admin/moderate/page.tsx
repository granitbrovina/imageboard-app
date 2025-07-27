import prisma from '@/lib/prisma';
import ModerationView from './ModerationView'; // We will create this next
import Link from 'next/link';

async function getAllThreads() {
    return prisma.thread.findMany({
        orderBy: { last_bumped_at: 'desc' },
        include: {
            replies: {
                orderBy: { created_at: 'asc' }
            }
        }
    });
}

export default async function ModerationPage() {
    const allThreads = await getAllThreads();

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-black p-4 border-b border-gray-700">
                <div className="container mx-auto">
                    <Link href="/admin" className="text-blue-400 hover:underline">&larr; Back to Dashboard</Link>
                    <h1 className="text-xl font-bold mt-2">Moderate Posts</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-8">
                <ModerationView initialThreads={allThreads} />
            </main>
        </div>
    );
}
