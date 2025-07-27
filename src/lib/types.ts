export interface Reply {
  id: number;
  post_text: string;
  image_url: string | null;
  created_at: string;
  threadId: number;
}

export interface Thread {
  id: number;
  post_text: string;
  image_url: string | null;
  image_alt: string | null;
  created_at: string;
  last_bumped_at: string;
  replies?: Reply[];
  _count?: {
    replies: number;
  };
}