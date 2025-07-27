import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { createHash } from 'crypto';

export async function GET() {
  try {
    console.log(`API: Fetching all threads with reply counts from DATABASE`);
    
    const threads = await prisma.thread.findMany({
      orderBy: {
        last_bumped_at: 'desc',
      },
      
      include: {
        _count: {
          select: { replies: true },
        },
      },
    });

    return NextResponse.json(threads);
  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch threads from database' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const ip_hash = createHash('sha256').update(ip).digest('hex');

    const existingBan = await prisma.ban.findUnique({ where: { ip_hash } });
    if (existingBan) {
      return NextResponse.json({ error: 'You are banned.' }, { status: 403 });
    }
    const body = await request.json();
    const { postText, image_url, recaptchaToken } = body;

    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed.' }, { status: 403 });
    }

    if (!postText) {
      return NextResponse.json({ error: 'Post text is required' }, { status: 400 });
    }
    
    const newThread = await prisma.$transaction(async (tx) => {
      const createdThread = await tx.thread.create({
        data: {
          post_text: postText,
          image_url: image_url || null,
          ip_hash: ip_hash,
        },
      });

      const MAX_THREADS = 300;
      const threadCount = await tx.thread.count();
      if (threadCount > MAX_THREADS) {
        const oldestThread = await tx.thread.findFirst({ orderBy: { last_bumped_at: 'asc' } });
        if (oldestThread) {
          await tx.thread.delete({ where: { id: oldestThread.id } });
          console.log(`API: Pruned oldest thread with ID: ${oldestThread.id}`);
        }
      }
      return createdThread;
    });

    return NextResponse.json(newThread, { status: 201 });
  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
