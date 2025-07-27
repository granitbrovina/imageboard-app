import React from 'react';
import Link from 'next/link';
import { MessageSquare, Repeat, Heart, Upload, MoreHorizontal, User } from 'lucide-react';
import { type Thread } from '@/lib/types';

const timeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000; if (interval > 1) return `${Math.floor(interval)}y`;
  interval = seconds / 2592000; if (interval > 1) return `${Math.floor(interval)}mo`;
  interval = seconds / 86400; if (interval > 1) return `${Math.floor(interval)}d`;
  interval = seconds / 3600; if (interval > 1) return `${Math.floor(interval)}h`;
  interval = seconds / 60; if (interval > 1) return `${Math.floor(interval)}m`;
  return `${Math.floor(seconds)}s`;
};

export default function ThreadCard({ thread }: { thread: Thread }) {
  // Use the reply count from the _count property, defaulting to 0
  const replyCount = thread._count?.replies ?? 0;

  return (
    <Link href={`/thread/${thread.id}`} className="block hover:bg-gray-900/50 transition-colors duration-200">
      <article className="border-b border-gray-800 bg-black cursor-pointer">
        <div className="p-4 flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-400" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span className="font-bold text-white">Anonymous</span>
                <span>·</span>
                <span>{timeAgo(thread.created_at)}</span>
              </div>
              <div className="text-gray-500 p-1"><MoreHorizontal size={20} /></div>
            </div>
            <p className="text-white mt-1 whitespace-pre-wrap">{thread.post_text}</p>
            {thread.image_url && (
              <div className="mt-3 rounded-2xl border border-gray-700 overflow-hidden">
                <img 
                  src={thread.image_url} 
                  alt={thread.image_alt || 'User uploaded image'}
                  className="w-full h-auto object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src='https://placehold.co/600x400/1a1a1b/ff0000?text=Image+Failed'; }}
                />
              </div>
            )}
            <div className="flex justify-between items-center mt-4 text-gray-500 max-w-sm">
              <div className="flex items-center space-x-1"><div className="p-2 rounded-full"><MessageSquare size={18} /></div><span className="text-sm">{replyCount}</span></div>
              <div className="flex items-center space-x-1"><div className="p-2 rounded-full"><Repeat size={18} /></div></div>
              <div className="flex items-center space-x-1"><div className="p-2 rounded-full"><Heart size={18} /></div></div>
              <div className="flex items-center space-x-1"><div className="p-2 rounded-full"><Upload size={18} /></div></div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
