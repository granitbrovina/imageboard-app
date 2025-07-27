import React from 'react';
import { Plus } from 'lucide-react';

export default function NewPostButton({ onClick }: { onClick: () => void }) {
  return (
    <button
        onClick={onClick}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 z-20"
        aria-label="Create new post"
    >
        <Plus size={28} />
    </button>
  );
}