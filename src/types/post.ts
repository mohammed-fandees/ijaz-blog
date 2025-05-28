export interface Post {
  slug: string;
  featured_image: string | undefined;
  published_at: string;
  reading_time: number;
  view_count: number;
  likes_count: number;
  category: { name: string; color: string; slug: string; } | undefined;
  excerpt: string;
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt?: Date;
  tags?: string[];
  published: boolean;
}