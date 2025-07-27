import prisma from '@/lib/prisma';
import Link from 'next/link';
import PagesListView from './PagesListView';

async function getPages() {
    return prisma.staticPage.findMany({
        orderBy: { slug: 'asc' },
    });
}

export default async function ManagePages() {
    const pages = await getPages();

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-black p-4 border-b border-gray-700">
                <div className="container mx-auto flex justify-between items-center">
                    <div>
                        <Link href="/admin" className="text-blue-400 hover:underline">&larr; Back to Dashboard</Link>
                        <h1 className="text-xl font-bold mt-2">Manage Site Pages</h1>
                    </div>
                    <Link href="/admin/pages/new" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
                        Create New Page
                    </Link>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-8">
                <PagesListView initialPages={pages} />
            </main>
        </div>
    );
}
