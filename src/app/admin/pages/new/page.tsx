import Link from 'next/link';
import PageCreateView from './PageCreateView';

export default function CreatePage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-black p-4 border-b border-gray-700">
                <div className="container mx-auto">
                    <Link href="/admin/pages" className="text-blue-400 hover:underline">&larr; Back to Pages</Link>
                    <h1 className="text-xl font-bold mt-2">Create New Page</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-8">
                <PageCreateView />
            </main>
        </div>
    );
}