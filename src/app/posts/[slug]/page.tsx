// src/app/posts/[slug]/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { PostComponent } from '@/components/post/PostComponent'
import { getSupabase } from '@/lib/supabase-client'

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  published_at: string;
  updated_at: string;
  content_updated_at?: string;
  status: string;
  view_count: number;
  likes_count: number;
  reading_time?: number;
  category_id: string | null;
  category: {
    name: string;
    color: string;
    slug: string;
  };
  tags?: string[];
}

export default function PostClientPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        setError(true);
        setIsLoading(false);
        return;
      }
      
      try {
        const supabase = getSupabase();
        
        // Fetch post data
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            categories(*)
          `)
          .eq('slug', slug)
          .eq('status', 'published')
          .single();
        
        if (error || !data) {
          console.error('Error fetching post:', error);
          setError(true);
          setIsLoading(false);
          return;
        }
        
        // تغيير عنوان الصفحة
        document.title = `${data.title} | إعجاز`;
        
        // تحويل البيانات
        setPost({
          ...data,
          content: data.content || '',
          category: data.categories
        });
      } catch (e) {
        console.error('Error:', e);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPost();
  }, [slug]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-primary"></div>
      </div>
    );
  }
  
  if (error || !post) {
    notFound();
  }

  return <PostComponent post={post} />;
}
