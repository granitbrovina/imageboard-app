'use client';

import React, { useState } from 'react';
import { type Ban } from '@prisma/client';
import { Trash2, Loader2 } from 'lucide-react';

async function createBan(ip_hash: string, reason: string) {
    const response = await fetch('/api/admin/bans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip_hash, reason }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create ban');
    }
    return response.json();
}

async function deleteBan(id: number) {
    const response = await fetch(`/api/admin/bans?id=${id}`, { method: 'DELETE' });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete ban');
    }
    return response.json();
}

export default function BanView({ initialBans }: { initialBans: Ban[] }) {
    const [bans, setBans] = useState(initialBans);
    const [ipHash, setIpHash] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateBan = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            const newBan = await createBan(ipHash, reason);
            setBans(prev => [newBan, ...prev]);
            setIpHash('');
            setReason('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteBan = async (id: number) => {
        if (!window.confirm('Are you sure you want to lift this ban?')) return;
        try {
            await deleteBan(id);
            setBans(prev => prev.filter(b => b.id !== id));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Could not delete ban');
        }
    };

    return (
        <div>
            {/* Create Ban Form */}
            <form onSubmit={handleCreateBan} className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
                <h3 className="text-lg font-semibold mb-4">Create New Ban</h3>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="IP Hash to Ban" value={ipHash} onChange={e => setIpHash(e.target.value)} required className="bg-gray-900 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Reason (optional)" value={reason} onChange={e => setReason(e.target.value)} className="bg-gray-900 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="submit" disabled={isSubmitting || !ipHash} className="bg-blue-600 hover:bg-blue-700 p-2 rounded disabled:opacity-50 flex items-center justify-center">
                        {isSubmitting && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        Create Ban
                    </button>
                </div>
            </form>

            {/* Ban List */}
            <div className="bg-gray-800 rounded-lg border border-gray-700">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-600">
                        <tr>
                            <th className="p-4">IP Hash</th>
                            <th className="p-4">Reason</th>
                            <th className="p-4">Banned By</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bans.map(ban => (
                            <tr key={ban.id} className="border-b border-gray-700 last:border-b-0">
                                <td className="p-4 font-mono text-sm truncate" title={ban.ip_hash}>{ban.ip_hash.substring(0, 20)}...</td>
                                <td className="p-4">{ban.reason || 'N/A'}</td>
                                <td className="p-4">{ban.banned_by}</td>
                                <td className="p-4">{new Date(ban.created_at).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <button onClick={() => handleDeleteBan(ban.id)} className="text-red-500 hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
