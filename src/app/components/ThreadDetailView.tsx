'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { type Thread, type Reply } from '@/lib/types';
import ThreadCard from './ThreadCard';
import ReplyCard from './ReplyCard';
import { Loader2, Send } from 'lucide-react';
import Link from 'next/link';

// Helper function to fetch data for a single thread
async function getThreadDetails(threadId: number): Promise<Thread & { replies: Reply[] }> {
  const response = await fetch(`/api/threads/${threadId}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch thread details');
  }
  return response.json();
}

interface ThreadDetailViewProps {
  threadId: string;
}

export default function ThreadDetailView({ threadId: threadIdString }: ThreadDetailViewProps) {
  const [thread, setThread] = useState<(Thread & { replies: Reply[] }) | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data when the component mounts
  useEffect(() => {
    const threadId = parseInt(threadIdString, 10);
    if (isNaN(threadId)) {
      setError('Invalid Thread ID.');
      setIsLoading(false);
      return;
    }

    getThreadDetails(threadId)
      .then(data => {
        setThread(data);
        setReplies(data.replies ?? []);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [threadIdString]);

  const handleReplySubmit = async () => {
    if (!replyText || isSubmitting || !thread) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/threads/${thread.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postText: replyText }),
      });

      if (!response.ok) throw new Error('Failed to post reply.');

      const newReply = await response.json();
      setReplies(prevReplies => [...prevReplies, newReply]);
      setReplyText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-black"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
  }

  if (error) {
    return <div className="flex flex-col justify-center items-center h-screen bg-black text-red-500"><p>Error: {error}</p><Link href="/" className="mt-4 text-blue-400 hover:underline">Go Home</Link></div>;
  }

  if (!thread) {
    return <div className="flex flex-col justify-center items-center h-screen bg-black text-white"><p>Thread not found.</p><Link href="/" className="mt-4 text-blue-400 hover:underline">Go Home</Link></div>;
  }

  return (
    <div className="bg-black min-h-screen font-sans text-white">
      <div className="max-w-2xl mx-auto border-x border-gray-800">
        <header className="p-4 border-b border-gray-700">
          <Link href="/" className="text-blue-400 hover:underline">&larr; Back to Feed</Link>
          <h1 className="text-xl font-bold mt-2">Thread</h1>
        </header>

        <ThreadCard thread={thread} />
        <div className="border-t-4 border-blue-500">{replies.map(reply => <ReplyCard key={reply.id} reply={reply} />)}</div>

        <div className="p-4 border-t border-gray-700 sticky bottom-0 bg-black/80 backdrop-blur-md">
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex items-center space-x-4">
            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Post your reply..." className="w-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none resize-none rounded-lg p-2" rows={2} />
            <button onClick={handleReplySubmit} disabled={!replyText || isSubmitting} className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
