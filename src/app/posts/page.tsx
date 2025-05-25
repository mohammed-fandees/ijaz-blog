// src/app/posts/[slug]/page.tsx
import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createServerSideSupabase } from '@/app/lib/supabase'
// import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// import { Separator } from '@/components/ui/separator'
import { 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark,
  Tag,
  ArrowRight,
  ArrowLeft,
  ChevronRight
} from 'lucide-react'
import { formatData, formatRelativeTime } from '@/lib/utils'
import { PostContent } from '@/components/post/PostContent'
import { ShareButtons } from '@/components/post/ShareButtons'
import { ReadingProgress } from '@/components/post/ReadingProgress'
import { RelatedPosts } from '@/components/post/RelatedPosts'
import { TableOfContents } from '@/components/post/TableOfContents'

interface PageProps {
  params: { slug: string }
}

async function getPost(slug: string) {
  const supabase = createServerSideSupabase()
  
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      categories(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    return null
  }

  // زيادة عدد المشاهدات
  await supabase
    .from('posts')
    .update({ view_count: post.view_count + 1 })
    .eq('id', post.id)

  return {
    ...post,
    category: post.categories
  }
}

async function getRelatedPosts(postId: string, categoryId: string | null) {
  const supabase = createServerSideSupabase()
  
  let query = supabase
    .from('posts')
    .select(`
      id,
      title,
      excerpt,
      slug,
      featured_image,
      published_at,
      reading_time,
      categories(name, color, slug)
    `)
    .eq('status', 'published')
    .neq('id', postId)
    .limit(3)

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data: posts, error } = await query

  if (error) {
    console.error('Error fetching related posts:', error)
    return []
  }

  return posts.map(post => ({
    ...post,
    category: post.categories
  }))
}

export default async function PostPage({ params }: PageProps) {
  const post = await getPost(params.slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category_id)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featured_image,
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "author": {
      "@type": "Organization",
      "name": "إعجاز"
    },
    "publisher": {
      "@type": "Organization",
      "name": "إعجاز",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.png"
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ReadingProgress />
      
      <article className="min-h-screen">
        {/* التنقل التفصيلي */}
        <div className="bg-muted/30 py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                الرئيسية
              </Link>
              <ChevronRight className="h-4 w-4" />
              {post.category && (
                <>
                  <Link 
                    href={`/categories/${post.category.slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {post.category.name}
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
              <span className="text-foreground">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* رأس المقال */}
        <header className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* الفئة */}
              {post.category && (
                <Link href={`/categories/${post.category.slug}`}>
                  <Badge 
                    className="mb-4 text-white hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: post.category.color }}
                  >
                    {post.category.name}
                  </Badge>
                </Link>
              )}

              {/* العنوان */}
              <h1 className="text-4xl md:text-5xl font-bold font-arabic leading-tight mb-6">
                {post.title}
              </h1>

              {/* المقتطف */}
              {post.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                  {post.excerpt}
                </p>
              )}

              {/* معلومات المقال */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Clock className="h-4 w-4" />
                  <span>{post.reading_time} دقيقة قراءة</span>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Eye className="h-4 w-4" />
                  <span>{post.view_count} مشاهدة</span>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes_count} إعجاب</span>
                </div>
              </div>

              {/* أدوات المشاركة */}
              <div className="flex items-center justify-between border-y py-4 mb-8">
                <ShareButtons post={post} />
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-1" />
                    حفظ
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-1" />
                    أعجبني
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* الصورة الرئيسية */}
        {post.featured_image && (
          <div className="mb-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* المحتوى الرئيسي */}
        <div className="pb-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {/* فهرس المحتويات */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <TableOfContents content={post.content} />
                </div>
              </div>

              {/* المحتوى */}
              <div className="lg:col-span-3">
                <PostContent content={post.content} />
                
                {/* العلامات */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t">
                    <h3 className="text-lg font-semibold font-arabic mb-4 flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      العلامات
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* أدوات نهاية المقال */}
                <div className="mt-12 pt-8 border-t">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-right">
                      <p className="text-muted-foreground mb-2">هل أعجبك هذا المقال؟</p>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Button variant="islamic" size="sm">
                          <Heart className="h-4 w-4 mr-1" />
                          أعجبني ({post.likes_count})
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          مشاركة
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-muted-foreground">
                        آخر تحديث: {formatRelativeTime(post.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* المقالات ذات الصلة */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <RelatedPosts posts={relatedPosts} />
            </div>
          </section>
        )}
      </article>
    </>
  )
}
