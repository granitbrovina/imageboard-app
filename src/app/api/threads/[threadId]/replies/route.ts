import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createHash } from 'crypto';

export async function POST(
  request: Request,
) {
  try {

    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const ip_hash = createHash('sha256').update(ip).digest('hex');

    const existingBan = await prisma.ban.findUnique({ where: { ip_hash } });
    if (existingBan) {
      return NextResponse.json({ error: 'You are banned.' }, { status: 403 });
    }

    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const threadIdString = pathParts[pathParts.length - 2];
    const threadId = parseInt(threadIdString, 10);
    
    if (isNaN(threadId)) {
      return NextResponse.json({ error: 'Invalid thread ID in URL' }, { status: 400 });
    }

    const body = await request.json();
    const { postText, image_url } = body;

    if (!postText) {
      return NextResponse.json({ error: 'Reply text is required' }, { status: 400 });
    }

    const newReply = await prisma.$transaction(async (tx) => {
      
      const createdReply = await tx.reply.create({
        data: {
          post_text: postText,
          image_url: image_url || null,
          threadId: threadId,
          ip_hash: ip_hash,
        },
      });

      await tx.thread.update({
        where: { id: threadId },
        data: {
          last_bumped_at: new Date(),
        },
      });
      
      console.log(`API: Created new reply for thread ${threadId} and bumped it.`);
      return createdReply;
    });

    return NextResponse.json(newReply, { status: 201 });

  } catch (error) {
    console.error("API Reply POST Error:", error);
 
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Parent thread not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
