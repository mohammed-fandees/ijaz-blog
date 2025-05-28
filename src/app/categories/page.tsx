'use client'

// src/app/categories/page.tsx
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowLeft, Tag, TrendingUp } from 'lucide-react'
import { PostCard } from '@/components/post/PostCard'
import { getSupabase } from '@/lib/supabase-client'
import AnimatedElement, { AnimatedContainer, AnimatedItem } from '@/components/ui/animated-element'

// تعريف الواجهات
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  posts?: { id: string }[];
  posts_count: number;
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

export default function CategoriesClientPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const supabase = getSupabase()
        
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select(`
            *,
            posts!inner(id)
          `)
          .order('name')

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError)
        } else {
          // حساب عدد المقالات لكل فئة
          const processedCategories = categoriesData.map(category => ({
            ...category,
            posts_count: category.posts?.length || 0
          }))
          setCategories(processedCategories as Category[])
        }
        
        // Fetch featured posts
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
          .order('view_count', { ascending: false })
          .limit(6)

        if (postsError) {
          console.error('Error fetching featured posts:', postsError)
        } else {
          const processedPosts = postsData.map(post => ({
            ...post,
            category: post.categories ? post.categories[0] : undefined
          }))
          setFeaturedPosts(processedPosts as Post[])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* رأس الصفحة */}
        <AnimatedElement animation="fadeInUp" className="text-center mb-12">
          <AnimatedElement animation="scale" delay={0.2} className="inline-block p-3 rounded-full bg-islamic-primary/10 text-islamic-primary mb-6">
            <Tag className="h-8 w-8" />
          </AnimatedElement>
          <h1 className="text-4xl font-bold font-arabic text-islamic-primary mb-4">
            فئات المقالات
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            استكشف مجموعة متنوعة من المواضيع الإسلامية المصنفة لسهولة التصفح والبحث
          </p>
        </AnimatedElement>

        {/* الفئات الرئيسية */}
        <div className="mb-16">
          <AnimatedElement animation="fadeInRight" threshold={0.2} className="flex items-center mb-8">
            <Tag className="h-6 w-6 text-islamic-primary ml-3" />
            <h2 className="text-2xl font-bold font-arabic">الفئات الرئيسية</h2>
            <div className="h-px bg-border flex-grow mr-4"></div>
          </AnimatedElement>

          <AnimatedContainer 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            staggerChildren={0.1}
            threshold={0.1}
          >
            {categories.map((category) => (
              <AnimatedItem key={category.id} animation="scale">
                <Link href={`/categories/${category.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden border border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 space-x-reverse">
                        <div 
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: category.color }}
                        >
                          <BookOpen className="h-8 w-8" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-bold font-arabic text-xl mb-2 group-hover:text-islamic-primary transition-colors">
                            {category.name}
                          </h3>
                          
                          {category.description && (
                            <p className="text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                              {category.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="font-arabic">
                              {category.posts_count} مقال
                            </Badge>
                            
                            <ArrowLeft className="h-4 w-4 text-islamic-primary opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedItem>
            ))}
          </AnimatedContainer>
        </div>

        {/* المقالات المميزة */}
        <div className="mb-16">
          <AnimatedElement animation="fadeInRight" threshold={0.2} className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-islamic-gold ml-3" />
              <h2 className="text-2xl font-bold font-arabic">المقالات الأكثر قراءة</h2>
              <div className="h-px bg-border flex-grow mr-4 hidden md:block"></div>
            </div>
            
            <Link href="/posts">
              <Button variant="outline" className="font-arabic">
                عرض المزيد
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </AnimatedElement>

          <AnimatedContainer 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            staggerChildren={0.1}
            threshold={0.1}
          >
            {featuredPosts.map((post) => (
              <AnimatedItem key={post.id} animation="fadeInUp">
                <PostCard post={post} />
              </AnimatedItem>
            ))}
          </AnimatedContainer>
        </div>

        {/* دعوة للعمل */}
        <AnimatedElement 
          className="text-center bg-gradient-to-br from-islamic-primary/10 to-islamic-gold/10 p-12 rounded-xl border border-islamic-primary/10"
          animation="fadeInUp"
          delay={0.5}
          threshold={0.1}
        >
          <h2 className="text-2xl font-bold font-arabic mb-4">
            لم تجد ما تبحث عنه؟
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            استخدم البحث للعثور على مقالات محددة أو تصفح الأرشيف الكامل لمقالاتنا
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button variant="islamic" size="lg" className="font-arabic">
                البحث في المقالات
              </Button>
            </Link>
            
            <Link href="/archive">
              <Button variant="outline" size="lg" className="font-arabic">
                تصفح الأرشيف
              </Button>
            </Link>
          </div>
        </AnimatedElement>
      </div>
    </div>
  )
}
