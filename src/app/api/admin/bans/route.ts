import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) { 
    const staff = await getCurrentUser();
    if (!staff) { return NextResponse.json({ error: 'Authentication required' }, { status: 401 }); }

    try {
        const { ip_hash, reason } = await request.json();
        if (!ip_hash) { return NextResponse.json({ error: 'IP Hash is required' }, { status: 400 }); }

        const newBan = await prisma.ban.create({
            data: { ip_hash, reason: reason || null, banned_by: staff.username }
        });
        return NextResponse.json(newBan, { status: 201 });
    } catch (error) {
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: 'This IP hash is already banned.' }, { status: 409 });
        }
        console.error("Admin Create Ban Error:", error);
        return NextResponse.json({ error: 'Failed to create ban' }, { status: 500 });
    }
}

export async function DELETE(request: Request) { 
    const staff = await getCurrentUser();
    if (!staff) { return NextResponse.json({ error: 'Authentication required' }, { status: 401 }); }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) { return NextResponse.json({ error: 'Ban ID is required' }, { status: 400 }); }

    try {
        await prisma.ban.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ message: 'Ban deleted successfully' });
    } catch (error) {
        console.error("Admin Delete Ban Error:", error);
        return NextResponse.json({ error: 'Failed to delete ban' }, { status: 500 });
    }
}
