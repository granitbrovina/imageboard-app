import Feed from '@/app/components/Feed';

// The Thread type should be defined in a central place, like src/lib/types.ts
// For now, we'll define it here.
export interface Thread {
  id: number;
  post_text: string;
  image_url: string | null;
  image_alt: string | null;
  created_at: string;
  reply_count: number;
  last_bumped_at: string;
}

async function getThreads(): Promise<Thread[]> {
  // In a real app, this URL should be in an environment variable.
  // The 'no-cache' option ensures we always get the latest data.
  const res = await fetch('http://localhost:3000/api/boards/rnd/threads', {
    cache: 'no-store', 
  });

  if (!res.ok) {
    // This will be caught by the Error Boundary in Next.js
    throw new Error('Failed to fetch threads');
  }

  return res.json();
}

export default async function HomePage() {
  const initialThreads = await getThreads();

  // We pass the server-fetched data to the client component as a prop.
  return <Feed initialThreads={initialThreads} />;
}
