import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const user = await getCurrentUser();
    if (!user) { redirect('/secret-login'); }
    
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-black p-4 border-b border-gray-700">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <div className="text-sm">Logged in as: <span className="font-semibold text-blue-400">{user.username}</span> ({user.role})</div>
                </div>
            </header>
            <main className="container mx-auto p-8">
                <h2 className="text-2xl font-semibold mb-6">Welcome to the Admin Panel</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/admin/moderate" className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                        <h3 className="font-bold text-lg mb-2">Moderate Posts</h3>
                        <p className="text-gray-400">View and delete threads and replies.</p>
                    </Link>
                    <Link href="/admin/bans" className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                        <h3 className="font-bold text-lg mb-2">Ban Users</h3>
                        <p className="text-gray-400">Manage IP-based bans.</p>
                    </Link>
                    {user.role === 'ADMIN' && (
                        <>
                            <Link href="/admin/pages" className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                                <h3 className="font-bold text-lg mb-2">Manage Site Pages</h3>
                                <p className="text-gray-400">Edit the homepage, rules, etc.</p>
                            </Link>
                            <Link href="/admin/staff" className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                                <h3 className="font-bold text-lg mb-2">Manage Staff</h3>
                                <p className="text-gray-400">Create and manage moderator accounts.</p>
                            </Link>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}