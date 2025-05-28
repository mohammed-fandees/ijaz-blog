'use client'

import React, { useEffect, useState } from 'react'
import { PostCard } from '@/components/post/PostCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent} from '@/components/ui/card'
import { 
  TrendingUp, 
  BookOpen,  
  Star,
  ArrowLeft,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { AnimatedStatsSection } from '@/components/stats/AnimatedStatsSection'
import AnimatedElement, { AnimatedContainer, AnimatedItem } from '@/components/ui/animated-element'
import { getSupabase } from '@/lib/supabase-client'

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

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
}

interface Stats {
  totalPosts: number;
  totalViews: number;
}

export default function HomePageClient() {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats>({ totalPosts: 0, totalViews: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const supabase = getSupabase();
        
        // فتش المقالات الحديثة
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
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(6);

        if (postsError) {
          console.error('Error fetching posts:', postsError);
        } else {
          const processedPosts = postsData.map(post => ({
            ...post,
            category: post.categories ? post.categories[0] : undefined
          }));
          setLatestPosts(processedPosts as Post[]);
        }
        
        // فتش المقال المميز
        const { data: featuredData, error: featuredError } = await supabase
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
          .eq('status', 'published')
          .order('view_count', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (featuredError) {
          console.error('Error fetching featured post:', featuredError);
        } else if (featuredData) {
          setFeaturedPost({
            ...featuredData,
            category: featuredData.categories ? featuredData.categories[0] : undefined
          } as Post);
        }
        
        // فتش التصنيفات
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
        } else {
          setCategories(categoriesData as Category[]);
        }
        
        // فتش الإحصائيات
        const { count: totalPosts, error: postsCountError } = await supabase
          .from('posts')
          .select('id', { count: 'exact' })
          .eq('status', 'published');
        
        if (postsCountError) {
          console.error('Error fetching posts count:', postsCountError);
        }
        
        const { data: viewsData, error: viewsError } = await supabase
          .from('posts')
          .select('view_count')
          .eq('status', 'published');
        
        let totalViews = 0;
        
        if (!viewsError && viewsData) {
          totalViews = viewsData.reduce((sum, post) => sum + (post.view_count || 0), 0);
        } else {
          console.error('Error fetching views count:', viewsError);
        }
        
        setStats({
          totalPosts: totalPosts || 0,
          totalViews: totalViews || 0
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* القسم الترحيبي */}
      <section className="relative py-20 bg-gradient-to-br from-islamic-primary/5 to-islamic-gold/5 islamic-pattern">
        <div className="container mx-auto px-4 text-center">
          <AnimatedElement animation="fadeInUp" delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold font-arabic text-islamic-primary mb-6">
              مرحباً بكم في إعجاز
            </h1>
          </AnimatedElement>
          
          <AnimatedElement animation="fadeInUp" delay={0.3}>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              مدونة إسلامية متخصصة في نشر المقالات والبحوث الشرعية التي تُثري المعرفة الإسلامية وتُقرب القارئ من فهم ديننا الحنيف
            </p>
          </AnimatedElement>
          
          <AnimatedElement animation="fadeInUp" delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/posts">
                <Button size="lg" variant="islamic" className="font-arabic">
                  <BookOpen className="ml-2 h-5 w-5" />
                  استكشف المقالات
                </Button>
              </Link>
              
              <Link href="/categories">
                <Button size="lg" variant="outline" className="font-arabic">
                  <Search className="ml-2 h-5 w-5" />
                  تصفح الفئات
                </Button>
              </Link>
            </div>
          </AnimatedElement>

          {/* إحصائيات سريعة مع أنيميشن */}
          <AnimatedStatsSection 
            totalPosts={stats.totalPosts} 
            totalViews={stats.totalViews} 
            categoriesCount={categories.length} 
          />
        </div>
      </section>

      {/* المقال المميز */}
      {featuredPost && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <AnimatedElement animation="fadeInRight" threshold={0.2}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold font-arabic flex items-center">
                  <Star className="ml-3 h-8 w-8 text-islamic-gold" />
                  المقال المميز
                </h2>
              </div>
            </AnimatedElement>
            
            <AnimatedElement animation="fadeInUp" delay={0.2} threshold={0.2}>
              <PostCard post={featuredPost} variant="featured" />
            </AnimatedElement>
          </div>
        </section>
      )}

      {/* الفئات الرئيسية */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedElement animation="fadeInRight" threshold={0.2}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-arabic">الفئات الرئيسية</h2>
              <Link href="/categories">
                <Button variant="outline" className="font-arabic">
                  عرض الكل
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </AnimatedElement>

          <AnimatedContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerChildren={0.1} threshold={0.1}>
            {categories.slice(0, 6).map((category) => (
              <AnimatedItem key={category.id} animation="scale">
                <Link href={`/categories/${category.slug}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold font-arabic text-lg mb-1">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedItem>
            ))}
          </AnimatedContainer>
        </div>
      </section>

      {/* أحدث المقالات */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimatedElement animation="fadeInRight" threshold={0.2}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-arabic flex items-center">
                <TrendingUp className="ml-3 h-8 w-8 text-islamic-primary" />
                أحدث المقالات
              </h2>
              <Link href="/posts">
                <Button variant="outline" className="font-arabic">
                  عرض المزيد
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </AnimatedElement>

          <AnimatedContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerChildren={0.1} threshold={0.1}>
            {latestPosts.map((post) => (
              <AnimatedItem key={post.id} animation="fadeInUp">
                <PostCard post={post} />
              </AnimatedItem>
            ))}
          </AnimatedContainer>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <AnimatedElement animation="fadeInUp" threshold={0.2}>
            <h2 className="text-3xl font-bold font-arabic mb-4 text-islamic-primary">
              انضم إلى رحلة المعرفة الإسلامية
            </h2>
          </AnimatedElement>
          
          <AnimatedElement animation="fadeInUp" delay={0.2} threshold={0.2}>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
              اكتشف كنوز المعرفة الإسلامية من خلال مقالاتنا المتنوعة والبحوث المعمقة
            </p>
          </AnimatedElement>
          
          <AnimatedElement animation="fadeInUp" delay={0.4} threshold={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about">
                <Button size="lg" variant="islamic" className="font-arabic">
                  تعرف علينا أكثر
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="font-arabic hover:bg-islamic-primary/5"
                >
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </AnimatedElement>
        </div>
      </section>
    </div>
  )
}
