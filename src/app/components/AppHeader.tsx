import React from 'react';

interface AppHeaderProps {
  boardName: string;
  boardDescription: string;
}

export default function AppHeader({ boardName, boardDescription }: AppHeaderProps) {
  return (
    <header className="bg-black bg-opacity-80 backdrop-blur-md border-b border-gray-700 p-4 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-white">{boardName}</h1>
        <p className="text-sm text-gray-400">{boardDescription}</p>
      </div>
    </header>
  );
}