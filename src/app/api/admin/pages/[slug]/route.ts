import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

async function isAdmin(): Promise<boolean> {
    const token = (await cookies()).get('auth_token')?.value;
    if (!token) return false;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload.role === 'ADMIN';
    } catch {
        return false;
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const { slug } = await params;
        const { title, content } = await request.json();
        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        const updatedPage = await prisma.staticPage.update({
            where: { slug: slug },
            data: { title, content },
        });

        return NextResponse.json(updatedPage);
    } catch (error) {
        console.error("Update Page Error:", error);
        return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
    }
}
