import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { hash } from 'bcryptjs';
import { Role } from '@prisma/client';

export async function GET() { 
    const admin = await getCurrentUser();
    if (!admin || admin.role !== 'ADMIN') { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
    
    const staff = await prisma.staff.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(staff);
}

export async function POST(request: Request) { 
    const admin = await getCurrentUser();
    if (!admin || admin.role !== 'ADMIN') { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }

    try {
        const { username, password } = await request.json();
        if (!username || !password || password.length < 8) {
            return NextResponse.json({ error: 'Username and a password of at least 8 characters are required' }, { status: 400 });
        }
        const hashedPassword = await hash(password, 12);
        const newStaff = await prisma.staff.create({
            data: { username, password: hashedPassword, role: Role.MODERATOR },
        });
        return NextResponse.json(newStaff, { status: 201 });
    } catch (error) {
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: 'Username is already taken.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create staff member' }, { status: 500 });
    }
}

export async function DELETE(request: Request) { 
    const admin = await getCurrentUser();
    if (!admin || admin.role !== 'ADMIN') { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) { return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 }); }

    const staffIdToDelete = parseInt(id);
    if (admin.id === staffIdToDelete) {
        return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
    }

    try {
        await prisma.staff.delete({ where: { id: staffIdToDelete } });
        return NextResponse.json({ message: 'Staff member deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete staff member' }, { status: 500 });
    }
}