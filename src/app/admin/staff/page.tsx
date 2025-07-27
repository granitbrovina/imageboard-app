import prisma from '@/lib/prisma';
import StaffView from './StaffView';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') { redirect('/admin'); }
    
    const staff = await prisma.staff.findMany({ orderBy: { createdAt: 'asc' } });
    
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-black p-4 border-b border-gray-700">
                <div className="container mx-auto">
                    <Link href="/admin" className="text-blue-400 hover:underline">&larr; Back to Dashboard</Link>
                    <h1 className="text-xl font-bold mt-2">Manage Staff</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-8">
                <StaffView initialStaff={staff} />
            </main>
        </div>
    );
}
