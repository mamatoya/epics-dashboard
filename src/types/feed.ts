export type FeedAuthorRole = 'director' | 'mentor' | 'instructor' | 'ta';

export interface FeedAuthor {
  name: string;
  role: FeedAuthorRole;
  avatar?: string; // URL to avatar image
}

export interface FeedMedia {
  type: 'image' | 'video' | 'youtube' | 'link';
  url: string;
  thumbnail?: string; // For videos/links
  caption?: string;
}

export interface FeedPost {
  id: string;
  author: FeedAuthor;
  content: string;
  media?: FeedMedia[];
  tags?: string[]; // e.g., 'announcement', 'heads-up', 'milestone', 'tip'
  pinned?: boolean;
  createdAt: string; // ISO date string
  updatedAt?: string;
}
