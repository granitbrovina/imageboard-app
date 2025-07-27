import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface GetContext {
  params: {
    threadId: string;
  };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const threadIdString = pathParts[pathParts.length - 1]; // Get the last part of the URL
    const threadId = parseInt(threadIdString, 10);
    
    if (isNaN(threadId)) {
      return NextResponse.json({ error: 'Invalid thread ID in URL' }, { status: 400 });
    }

    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        replies: {
          orderBy: {
            created_at: 'asc',
          },
        },
      },
    });

    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    return NextResponse.json(thread);
  } catch (error) {
    console.error("API GET Thread Error:", error);
    return NextResponse.json({ error: 'Failed to fetch thread' }, { status: 500 });
  }
}