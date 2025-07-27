'use client';

import React, { useState } from 'react';
import { type Thread, type Reply } from '@prisma/client';
import { Trash2, Loader2, Gavel } from 'lucide-react';

type ThreadWithReplies = Thread & { replies: Reply[] };

// API call to create a new ban
async function createBan(ip_hash: string, reason: string) {
    const response = await fetch('/api/admin/bans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip_hash, reason }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create ban');
    }
    return response.json();
}

async function deletePost(id: number, type: 'thread' | 'reply') {
    const url = type === 'thread' ? `/api/admin/posts?threadId=${id}` : `/api/admin/posts?replyId=${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete');
    }
    return response.json();
}

function PostControls({ post, type, onPostDelete }: { post: Thread | Reply, type: 'thread' | 'reply', onPostDelete: (id: number, type: 'thread' | 'reply') => void }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isBanning, setIsBanning] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        setIsDeleting(true);
        try {
            await deletePost(post.id, type);
            onPostDelete(post.id, type);
        } catch (error) {
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsDeleting(false);
        }
    };
    
    const handleBan = async () => {
        if (!post.ip_hash) {
            alert("This post has no IP hash and cannot be banned.");
            return;
        }
        const reason = prompt(`Enter reason for banning this user (optional). The post will also be deleted.`);
        if (reason === null) return; // User cancelled

        setIsBanning(true);
        try {
            await createBan(post.ip_hash, reason || `Banned for post ${type} #${post.id}`);
            await deletePost(post.id, type);
            onPostDelete(post.id, type);
            alert("User has been banned and the post deleted.");
        } catch (error) {
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsBanning(false);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <button onClick={handleBan} disabled={isBanning || !post.ip_hash} className="text-yellow-500 hover:text-yellow-400 disabled:text-gray-500 p-1" title="Ban User & Delete Post">
                {isBanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gavel className="w-4 h-4" />}
            </button>
            <button onClick={handleDelete} disabled={isDeleting} className="text-red-500 hover:text-red-400 disabled:text-gray-500 p-1" title="Delete Post">
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
        </div>
    );
}

export default function ModerationView({ initialThreads }: { initialThreads: ThreadWithReplies[] }) {
    const [threads, setThreads] = useState(initialThreads);
    const handlePostDelete = (id: number, type: 'thread' | 'reply') => {
        if (type === 'thread') {
            setThreads(prev => prev.filter(t => t.id !== id));
        } else {
            setThreads(prev => prev.map(t => ({
                ...t,
                replies: t.replies.filter(r => r.id !== id)
            })));
        }
    };

    return (
        <div className="space-y-8">
            {threads.map(thread => (
                <div key={thread.id} className="bg-gray-800 border border-gray-700 rounded-lg">
                    <div className="p-4 border-b border-gray-600 flex justify-between items-start">
                        <div>
                            <p className="font-bold text-lg">Thread #{thread.id}</p>
                            <p className="text-gray-400 text-xs font-mono mt-1">IP Hash: {thread.ip_hash || 'N/A'}</p>
                            <p className="text-gray-300 mt-2">{thread.post_text}</p>
                            {thread.image_url && <a href={thread.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline mt-1 block">View Image</a>}
                        </div>
                        <PostControls post={thread} type="thread" onPostDelete={handlePostDelete} />
                    </div>
                    <div className="space-y-2 p-4">
                        {thread.replies.map(reply => (
                            <div key={reply.id} className="bg-gray-700/50 p-3 rounded flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-sm">Reply #{reply.id}</p>
                                    <p className="text-gray-400 text-xs font-mono mt-1">IP Hash: {reply.ip_hash || 'N/A'}</p>
                                    <p className="text-gray-300 text-sm mt-2">{reply.post_text}</p>
                                </div>
                                <PostControls post={reply} type="reply" onPostDelete={handlePostDelete} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
