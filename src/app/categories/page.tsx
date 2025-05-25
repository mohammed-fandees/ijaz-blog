// src/app/categories/page.tsx
import React from 'react'
import Link from 'next/link'
import { createServerSideSupabase } from '@/app/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowLeft, Tag, TrendingUp } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الفئات | إعجاز',
  description: 'استكشف مختلف فئات المقالات الإسلامية في مدونة إعجاز',
}

async function getCategories() {
  const supabase = createServerSideSupabase()
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select(`
      *,
      posts!inner(id)
    `)
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  // حساب عدد المقالات لكل فئة
  return categories.map(category => ({
    ...category,
    posts_count: category.posts?.length || 0
  }))
}

async function getFeaturedPosts() {
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
      categories(name, color, slug)
    `)
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }

  return posts.map(post => ({
    ...post,
    category: post.categories
  }))
}

export default async function CategoriesPage() {
  const [categories, featuredPosts] = await Promise.all([
    getCategories(),
    getFeaturedPosts()
  ])

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* رأس الصفحة */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-arabic text-islamic-primary mb-4">
            فئات المقالات
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            استكشف مجموعة متنوعة من المواضيع الإسلامية المصنفة لسهولة التصفح والبحث
          </p>
        </div>

        {/* الفئات الرئيسية */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <Tag className="h-6 w-6 text-islamic-primary mr-3" />
            <h2 className="text-2xl font-bold font-arabic">الفئات الرئيسية</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
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
                          
                          <ArrowLeft className="h-4 w-4 text-islamic-primary group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* المقالات المميزة */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-islamic-gold mr-3" />
              <h2 className="text-2xl font-bold font-arabic">المقالات الأكثر قراءة</h2>
            </div>
            
            <Link href="/posts">
              <Button variant="outline" className="font-arabic">
                عرض المزيد
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {post.featured_image && (
                  <div className="relative h-48">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    {post.category && (
                      <Badge 
                        className="absolute top-3 right-3 text-white"
                        style={{ backgroundColor: post.category.color }}
                      >
                        {post.category.name}
                      </Badge>
                    )}
                  </div>
                )}
                
                <CardContent className="p-6">
                  <Link href={`/posts/${post.slug}`}>
                    <h3 className="font-bold font-arabic text-lg mb-2 line-clamp-2 hover:text-islamic-primary transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  
                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{post.reading_time} دقيقة قراءة</span>
                    <span>{post.view_count} مشاهدة</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* دعوة للعمل */}
        <div className="text-center bg-gradient-to-br from-islamic-primary/5 to-islamic-gold/5 p-12 rounded-xl">
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
        </div>
      </div>
    </div>
  )
}
