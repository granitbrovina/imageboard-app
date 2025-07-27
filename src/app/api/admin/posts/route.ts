import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(request: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('threadId');
    const replyId = searchParams.get('replyId');

    try {
        if (replyId) {
            await prisma.reply.delete({ where: { id: parseInt(replyId) } });
            return NextResponse.json({ message: `Reply ${replyId} deleted` });
        } else if (threadId) {
            await prisma.thread.delete({ where: { id: parseInt(threadId) } });
            return NextResponse.json({ message: `Thread ${threadId} and its replies deleted` });
        } else {
            return NextResponse.json({ error: 'Missing threadId or replyId' }, { status: 400 });
        }
    } catch (error) {
        console.error("Admin Delete Error:", error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}