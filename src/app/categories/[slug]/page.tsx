// src/app/categories/[slug]/page.tsx
import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSideSupabase } from '@/app/lib/supabase'
import { PostCard } from '@/components/post/PostCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, BookOpen, ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'

interface PageProps {
  params: { slug: string }
}

async function getCategory(slug: string) {
  const supabase = createServerSideSupabase()
  
  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return category
}

async function getCategoryPosts(categoryId: string) {
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
    .eq('category_id', categoryId)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching category posts:', error)
    return []
  }

  return posts.map(post => ({
    ...post,
    category: post.categories
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await getCategory(params.slug)
  
  if (!category) {
    return {
      title: 'فئة غير موجودة',
    }
  }

  return {
    title: `${category.name} | إعجاز`,
    description: category.description || `مقالات متعلقة بـ ${category.name}`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await getCategory(params.slug)
  
  if (!category) {
    notFound()
  }

  const posts = await getCategoryPosts(category.id)

  return (
    <div className="min-h-screen">
      {/* التنقل التفصيلي */}
      <div className="bg-muted/30 py-4">
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
      </div>

      {/* رأس الفئة */}
      <div className="py-16 bg-gradient-to-br from-islamic-primary/5 to-islamic-gold/5">
        <div className="container mx-auto px-4 text-center">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white mx-auto mb-6"
            style={{ backgroundColor: category.color }}
          >
            <BookOpen className="h-10 w-10" />
          </div>
          
          <h1 className="text-4xl font-bold font-arabic text-islamic-primary mb-4">
            {category.name}
          </h1>
          
          {category.description && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
              {category.description}
            </p>
          )}
          
          <div className="flex items-center justify-center space-x-4 space-x-reverse">
            <Badge 
              variant="secondary" 
              className="text-lg px-4 py-2"
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              {posts.length} مقال
            </Badge>
          </div>
        </div>
      </div>

      {/* المقالات */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
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
            </div>
          )}
        </div>
      </div>

      {/* اقتراحات أخرى */}
      {posts.length > 0 && (
        <div className="py-12 bg-muted/30">
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
        </div>
      )}
    </div>
  )
}
