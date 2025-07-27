'use client';

import ThreadDetailView from '@/app/components/ThreadDetailView';
import { useParams } from 'next/navigation';

export default function ThreadPage() {

  const params = useParams();
  const threadId = params.threadId as string;

  return <ThreadDetailView threadId={threadId} />;
}

