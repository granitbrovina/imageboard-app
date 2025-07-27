import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageEditView from './PageEditView';

export const dynamic = 'force-dynamic';

async function getPage(slug: string) {
    return prisma.staticPage.findUnique({ where: { slug } });
}

export default async function EditPage({ params }: { params: Promise<{ slug: string }>}) {
    const { slug } = await params;
    const page = await getPage(slug);
    
    if (!page) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-black p-4 border-b border-gray-700">
                <div className="container mx-auto">
                    <Link href="/admin/pages" className="text-blue-400 hover:underline">&larr; Back to Pages</Link>
                    <h1 className="text-xl font-bold mt-2">Editing: {page.title}</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-8">
                <PageEditView page={page} />
            </main>
        </div>
    );
}
