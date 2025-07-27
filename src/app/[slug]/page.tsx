import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

async function getPage(slug: string) {

    if (slug.startsWith('admin') || slug === 'secret-login') return null;
    return prisma.staticPage.findUnique({ where: { slug } });
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getPage(slug);
    if (!page) {
        notFound();
    }

    return (
        <div className="bg-black min-h-screen font-sans text-white">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <header className="mb-8">
                    <Link href="/" className="text-blue-400 hover:underline">&larr; Back to Main Board</Link>
                </header>
                <main>
                    <article className="prose prose-invert lg:prose-xl bg-gray-900 border border-gray-700 rounded-lg p-8"
                        // This is safe because the content is controlled by the admin
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </main>
            </div>
        </div>
    );
}
