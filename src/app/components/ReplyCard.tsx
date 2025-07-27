import React from 'react';
import { User } from 'lucide-react';
import { type Reply } from '@/lib/types';

const timeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000; if (interval > 1) return `${Math.floor(interval)}y`;
  interval = seconds / 2592000; if (interval > 1) return `${Math.floor(interval)}mo`;
  interval = seconds / 86400; if (interval > 1) return `${Math.floor(interval)}d`;
  interval = seconds / 3600; if (interval > 1) return `${Math.floor(interval)}h`;
  interval = seconds / 60; if (interval > 1) return `${Math.floor(interval)}m`;
  return `${Math.floor(seconds)}s`;
};

export default function ReplyCard({ reply }: { reply: Reply }) {
  return (
    <article className="border-b border-gray-800 bg-black p-4 flex space-x-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <User className="w-6 h-6 text-gray-400" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <span className="font-bold text-white">Anonymous</span>
          <span>·</span>
          <span>Reply No. {reply.id}</span>
          <span>·</span>
          <span>{timeAgo(reply.created_at)}</span>
        </div>
        <p className="text-white mt-1 whitespace-pre-wrap">{reply.post_text}</p>
        {reply.image_url && (
          <div className="mt-3 rounded-2xl border border-gray-700 overflow-hidden max-w-xs">
            <img 
              src={reply.image_url} 
              alt={'User uploaded image'}
              className="w-full h-auto object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src='https://placehold.co/400x300/1a1a1b/ff0000?text=Image+Failed'; }}
            />
          </div>
        )}
      </div>
    </article>
  );
}
