'use client'

// src/app/categories/[slug]/page.tsx
import React, { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { PostCard } from '@/components/post/PostCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, BookOpen, ArrowLeft, Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import { getSupabase } from '@/lib/supabase-client'

// متغيرات الحركة
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
}

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured_image?: string;
  published_at: string;
  reading_time: number;
  view_count: number;
  likes_count: number;
  tags?: string[];
  categories?: {
    name: string;
    color: string;
    slug: string;
  }[];
  category?: {
    name: string;
    color: string;
    slug: string;
  };
}

export default function CategoryClientPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const supabase = getSupabase();
        
        // Fetch category
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();

        if (categoryError) {
          console.error('Error fetching category:', categoryError);
          setError(true);
          return;
        }
        
        setCategory(categoryData as Category);
        
        // تغيير عنوان الصفحة
        document.title = `${categoryData.name} | إعجاز`;
        
        // Fetch category posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            excerpt,
            slug,
            featured_image,
            published_at,
            reading_time,
            view_count,
            likes_count,
            tags,
            categories(name, color, slug)
          `)
          .eq('category_id', categoryData.id)
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (postsError) {
          console.error('Error fetching category posts:', postsError);
          setPosts([]);
        } else {
          const processedPosts = postsData.map(post => ({
            ...post,
            category: post.categories ? post.categories[0] : undefined
          }));
          setPosts(processedPosts as Post[]);
        }
      } catch (e) {
        console.error('Error:', e);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-primary"></div>
      </div>
    );
  }

  if (error || !category) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* التنقل التفصيلي */}
      <motion.div 
        className="bg-muted/30 py-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              الرئيسية
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/categories" className="hover:text-foreground transition-colors">
              الفئات
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{category.name}</span>
          </nav>
        </div>
      </motion.div>

      {/* رأس الفئة */}
      <motion.div 
        className="py-16 bg-gradient-to-br from-islamic-primary/10 to-islamic-gold/10 border-b border-border/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white mx-auto mb-6"
            style={{ backgroundColor: category.color }}
          >
            <BookOpen className="h-10 w-10" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold font-arabic text-islamic-primary mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {category.name}
          </motion.h1>
          
          {category.description && (
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {category.description}
            </motion.p>
          )}
          
          <motion.div 
            className="flex items-center justify-center space-x-4 space-x-reverse"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Badge 
              variant="secondary" 
              className="text-lg px-4 py-2"
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              {posts.length} مقال
            </Badge>
          </motion.div>
        </div>
      </motion.div>

      {/* المقالات */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <>
              <motion.div 
                className="flex items-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Tag className="h-6 w-6 text-islamic-primary ml-3" />
                <h2 className="text-2xl font-bold font-arabic">
                  مقالات {category.name}
                </h2>
                <div className="h-px bg-border flex-grow mr-4"></div>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {posts.map((post) => (
                  <motion.div key={post.id} variants={item}>
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            <motion.div 
              className="text-center py-16 bg-muted/10 rounded-xl border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold font-arabic mb-4">
                لا توجد مقالات في هذه الفئة حالياً
              </h3>
              <p className="text-muted-foreground mb-6">
                سيتم إضافة مقالات جديدة قريباً في هذه الفئة
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/categories">
                  <Button variant="islamic" className="font-arabic">
                    استكشف الفئات الأخرى
                  </Button>
                </Link>
                
                <Link href="/posts">
                  <Button variant="outline" className="font-arabic">
                    جميع المقالات
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* اقتراحات أخرى */}
      {posts.length > 0 && (
        <motion.div 
          className="py-12 bg-gradient-to-br from-islamic-primary/5 to-islamic-gold/5 border-t border-border/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold font-arabic mb-6">
              استكشف المزيد
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories">
                <Button variant="outline" className="font-arabic">
                  الفئات الأخرى
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
              
              <Link href="/posts">
                <Button variant="islamic" className="font-arabic">
                  جميع المقالات
                  <BookOpen className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
