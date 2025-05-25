// src/app/page.tsx
import React from 'react'
import { createServerSideSupabase } from '@/app/lib/supabase'
import { PostCard } from '@/components/post/PostCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  Star,
  ArrowLeft,
  Search
} from 'lucide-react'
import Link from 'next/link'

async function getLatestPosts() {
  const supabase = createServerSideSupabase()
  
  const { data: posts, error } = await supabase
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
    .limit(6)

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return posts.map(post => ({
    ...post,
    category: post.categories
  }))
}

async function getFeaturedPost() {
  const supabase = createServerSideSupabase()
  
  const { data: post, error } = await supabase
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
    .single()

  if (error) {
    console.error('Error fetching featured post:', error)
    return null
  }

  return {
    ...post,
    category: post.categories
  }
}

async function getCategories() {
  const supabase = createServerSideSupabase()
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return categories
}

async function getStats() {
  const supabase = createServerSideSupabase()
  
  const [postsResult, viewsResult] = await Promise.all([
    supabase.from('posts').select('id', { count: 'exact' }).eq('status', 'published'),
    supabase.from('analytics_events').select('id', { count: 'exact' }).eq('event_type', 'page_view')
  ])

  return {
    totalPosts: postsResult.count || 0,
    totalViews: viewsResult.count || 0,
  }
}

export default async function HomePage() {
  const [latestPosts, featuredPost, categories, stats] = await Promise.all([
    getLatestPosts(),
    getFeaturedPost(),
    getCategories(),
    getStats()
  ])

  return (
    <div className="min-h-screen">
      {/* القسم الترحيبي */}
      <section className="relative py-20 bg-gradient-to-br from-islamic-primary/5 to-islamic-gold/5 islamic-pattern">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-arabic text-islamic-primary mb-6">
            مرحباً بكم في إعجاز
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            مدونة إسلامية متخصصة في نشر المقالات والبحوث الشرعية التي تُثري المعرفة الإسلامية وتُقرب القارئ من فهم ديننا الحنيف
          </p>
          
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

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-islamic-primary">{stats.totalPosts}</div>
                <div className="text-sm text-muted-foreground">مقال منشور</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-islamic-gold">{stats.totalViews}</div>
                <div className="text-sm text-muted-foreground">مشاهدة</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{categories.length}</div>
                <div className="text-sm text-muted-foreground">فئة متنوعة</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-muted-foreground">متاح دائماً</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* المقال المميز */}
      {featuredPost && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-arabic flex items-center">
                <Star className="mr-3 h-8 w-8 text-islamic-gold" />
                المقال المميز
              </h2>
            </div>
            
            <PostCard post={featuredPost} variant="featured" />
          </div>
        </section>
      )}

      {/* الفئات الرئيسية */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-arabic">الفئات الرئيسية</h2>
            <Link href="/categories">
              <Button variant="outline" className="font-arabic">
                عرض الكل
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
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
            ))}
          </div>
        </div>
      </section>

      {/* أحدث المقالات */}
      <section className="py-16">
        <div className="container mx-auto px-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-16 bg-islamic-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-arabic mb-4">
            انضم إلى رحلة المعرفة الإسلامية
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            اكتشف كنوز المعرفة الإسلامية من خلال مقالاتنا المتنوعة والبحوث المعمقة
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about">
              <Button size="lg" variant="secondary" className="font-arabic">
                تعرف علينا أكثر
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="font-arabic text-white border-white hover:bg-white hover:text-islamic-primary">
                تواصل معنا
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
