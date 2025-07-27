'use client';

import React, { useState } from 'react';
import { type Staff, Role } from '@prisma/client';
import { Trash2, Loader2 } from 'lucide-react';

async function createStaff(username: string, password: string): Promise<Staff> {
    const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error(await res.json().then(d => d.error));
    return res.json();
}

async function deleteStaff(id: number) {
    const res = await fetch(`/api/admin/staff?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.json().then(d => d.error));
}

export default function StaffView({ initialStaff }: { initialStaff: Staff[] }) {
    const [staffList, setStaffList] = useState(initialStaff);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            const newStaff = await createStaff(username, password);
            setStaffList(prev => [...prev, newStaff]);
            setUsername('');
            setPassword('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteStaff = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) return;
        try {
            await deleteStaff(id);
            setStaffList(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Could not delete staff member');
        }
    };

    return (
        <div>
            <form onSubmit={handleCreateStaff} className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
                <h3 className="text-lg font-semibold mb-4">Create New Moderator</h3>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required className="bg-gray-900 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="password" placeholder="Password (min 8 chars)" value={password} onChange={e => setPassword(e.target.value)} required className="bg-gray-900 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="submit" disabled={isSubmitting || !username || password.length < 8} className="bg-blue-600 hover:bg-blue-700 p-2 rounded disabled:opacity-50 flex items-center justify-center">
                        {isSubmitting && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        Create Moderator
                    </button>
                </div>
            </form>

            <div className="bg-gray-800 rounded-lg border border-gray-700">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-600">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Username</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffList.map(staff => (
                            <tr key={staff.id} className="border-b border-gray-700 last:border-b-0">
                                <td className="p-4">{staff.id}</td>
                                <td className="p-4">{staff.username}</td>
                                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${staff.role === Role.ADMIN ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{staff.role}</span></td>
                                <td className="p-4">
                                    {staff.role !== Role.ADMIN && (
                                        <button onClick={() => handleDeleteStaff(staff.id)} className="text-red-500 hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
