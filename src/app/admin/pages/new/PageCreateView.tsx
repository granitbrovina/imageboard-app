'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

async function createPage(data: { title: string; slug: string; content: string }) {
    const response = await fetch(`/api/admin/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create page');
    }
    return response.json();
}

export default function PageCreateView() {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        // Auto-generate slug from title
        setSlug(newTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            await createPage({ title, slug, content });
            router.push('/admin/pages'); // Redirect to the list on success
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Page Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full bg-gray-900 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">Page Slug (URL)</label>
                <input
                    id="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-gray-900 p-2 rounded border border-gray-600 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">Page Content (HTML allowed)</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={15}
                    className="w-full bg-gray-900 p-2 rounded border border-gray-600 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex items-center justify-end">
                <button type="submit" disabled={isSubmitting || !title || !slug} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded disabled:opacity-50 flex items-center justify-center">
                    {isSubmitting && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                    Create Page
                </button>
            </div>
        </form>
    );
}
