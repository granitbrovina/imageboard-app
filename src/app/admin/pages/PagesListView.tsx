'use client';

import { useState } from 'react';
import { type StaticPage } from '@prisma/client';
import Link from 'next/link';
import { FileEdit, Trash2, Loader2 } from 'lucide-react';

async function deletePage(id: number) {
    const response = await fetch(`/api/admin/pages?id=${id}`, { method: 'DELETE' });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete page');
    }
}

export default function PagesListView({ initialPages }: { initialPages: StaticPage[] }) {
    const [pages, setPages] = useState(initialPages);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this page? This cannot be undone.')) return;
        setDeletingId(id);
        try {
            await deletePage(id);
            setPages(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            alert(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700">
            <ul className="divide-y divide-gray-700">
                {pages.map(page => (
                    <li key={page.id} className="p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-lg">{page.title}</h3>
                            <p className="text-sm text-gray-400 font-mono">/{page.slug}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href={`/admin/pages/edit/${page.slug}`} className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md transition-colors">
                                <FileEdit className="w-4 h-4" />
                                <span>Edit</span>
                            </Link>
                            <button onClick={() => handleDelete(page.id)} disabled={deletingId === page.id} className="flex items-center space-x-2 text-red-500 hover:text-red-400 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md transition-colors disabled:opacity-50">
                                {deletingId === page.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                <span>Delete</span>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
