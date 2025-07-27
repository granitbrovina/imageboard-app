'use client';

import React, { useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

import AppHeader from './AppHeader';
import ThreadCard from './ThreadCard';
import NewPostButton from './NewPostButton';
import NewPostModal from './NewPostModal';
import { type Thread } from '@/lib/types';

interface FeedProps {
  initialThreads: Thread[];
}

export default function Feed({ initialThreads }: FeedProps) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  
  const handlePostSubmit = useCallback(async (postData: { postText: string, image_url: string | null }) => {
    setIsSubmitting(true);
    try {
 
      const response = await fetch('/api/boards/rnd/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const newThread = await response.json();

        setThreads(prevThreads => [newThread, ...prevThreads]);
      } else {

        console.error("Failed to create post");
        alert("Error: Could not create post.");
      }
    } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred while creating the post.");
    } finally {
        setIsSubmitting(false);
    }
  }, []);

  return (
    <div className="bg-black min-h-screen font-sans text-white">
      <div className="max-w-2xl mx-auto border-x border-gray-800">
        <AppHeader 
          boardName="/rnd/ - Random"
          boardDescription="A board for anything and everything. All posts are ephemeral."
        />
        
        <main>
          {threads.map(thread => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </main>
      </div>

      <NewPostButton onClick={openModal} />
      
      <NewPostModal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        onPostSubmit={handlePostSubmit}
      />
    </div>
  );
}
