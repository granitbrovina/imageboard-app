'use client';

import { useState } from 'react';
import { type StaticPage } from '@prisma/client';
import { Loader2 } from 'lucide-react';

async function updatePage(slug: string, data: { title: string; content: string }) {
    const response = await fetch(`/api/admin/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update page');
    }
    return response.json();
}

export default function PageEditView({ page }: { page: StaticPage }) {
    const [title, setTitle] = useState(page.title);
    const [content, setContent] = useState(page.content);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);
        try {
            await updatePage(page.slug, { title, content });
            setMessage('Page updated successfully!');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Page Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-900 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="flex items-center justify-end space-x-4">
                {message && <p className="text-sm text-green-400">{message}</p>}
                <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded disabled:opacity-50 flex items-center justify-center">
                    {isSubmitting && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                    Save Changes
                </button>
            </div>
        </form>
    );
}
