import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const admin = await getCurrentUser();
        if (!admin || admin.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { title, slug, content } = await request.json();
        if (!title || !slug) {
            return NextResponse.json({ error: 'Title and Slug are required' }, { status: 400 });
        }

        const newPage = await prisma.staticPage.create({
            data: { title, slug, content: content || '' },
        });
        return NextResponse.json(newPage, { status: 201 });
    } catch (error) {
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: 'A page with this slug already exists.' }, { status: 409 });
        }
        console.error("API Create Page Error:", error);
        return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const admin = await getCurrentUser();
        if (!admin || admin.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
        }

        await prisma.staticPage.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ message: 'Page deleted successfully' });
    } catch (error) {
        console.error("API Delete Page Error:", error);
        return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
    }
}
