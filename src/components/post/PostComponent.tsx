'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  Eye, 
  Heart,
  Tag,
  ChevronRight
} from 'lucide-react'
import { formatDate, formatRelativeTime, formatArabicNumber } from '@/lib/utils'
import { PostContent } from '@/components/post/PostContent'
import { ShareButtons } from '@/components/post/ShareButtons'
import { ReadingProgress } from '@/components/post/ReadingProgress'
import { RelatedPosts } from '@/components/post/RelatedPosts'
import { TableOfContents } from '@/components/post/TableOfContents'
import { LikeButton } from '@/components/post/LikeButton'
import { BookmarkButton } from '@/components/post/BookmarkButton'
import { 
  getSupabase, 
  incrementViewCount, 
  hasViewedPost, 
  markPostAsViewed 
} from '@/lib/supabase-client'
import AnimatedElement, { AnimatedContainer, AnimatedItem } from '@/components/ui/animated-element'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image?: string
  published_at: string
  updated_at: string
  content_updated_at?: string
  status: string
  view_count: number
  likes_count: number
  reading_time?: number
  category_id: string | null
  category: {
    name: string
    color: string
    slug: string
  }
  tags?: string[]
}

interface RelatedPost {
  id: string
  title: string
  excerpt: string
  slug: string
  featured_image: string
  published_at: string
  reading_time: number
  view_count: number
  categories: {
    name: string
    color: string
    slug: string
  }
  category: {
    name: string
    color: string
    slug: string
  }
}

export function PostComponent({ post }: { post: Post }) {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const [viewCount, setViewCount] = useState(post.view_count)
  const [viewUpdated, setViewUpdated] = useState(false)
  
  // تحديث عدد المشاهدات مرة واحدة فقط عند تحميل الصفحة
  useEffect(() => {
    async function updateViewCount() {
      try {
        // التحقق مما إذا كانت المشاهدة قد تم تسجيلها من قبل
        if (!hasViewedPost(post.id) && !viewUpdated) {
          console.log(`Updating view count for post ${post.id}`);
          
          // تسجيل المشاهدة محليًا
          markPostAsViewed(post.id);
          
          // تحديث العداد في قاعدة البيانات
          const newCount = await incrementViewCount(post.id);
          
          if (newCount !== null) {
            // تحديث العدد المحلي
            setViewCount(newCount);
            setViewUpdated(true);
            console.log('View count updated successfully to:', newCount);
          } else {
            // حتى في حالة الفشل، نعرض للمستخدم أن مشاهدته تم احتسابها
            setViewCount(viewCount + 1);
            setViewUpdated(true);
          }
        }
      } catch (error) {
        console.error('Failed to update view count:', error);
      }
    }
    
    updateViewCount();
  }, [post.id, viewCount, viewUpdated]);

  // جلب المقالات ذات الصلة
  useEffect(() => {
    async function fetchRelatedPosts() {
      try {
        const supabase = getSupabase();
        
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
            view_count,
            categories(name, color, slug)
          `)
          .eq('status', 'published')
          .neq('id', post.id)
          .limit(3);

        if (post.category_id) {
          query = query.eq('category_id', post.category_id);
        }

        const { data: posts, error } = await query;

        if (error) {
          console.error('Error fetching related posts:', error);
          return;
        }

        const formattedPosts = posts.map(post => ({
          ...post,
          category: post.categories
        })) as unknown as RelatedPost[];

        setRelatedPosts(formattedPosts);
      } catch (error) {
        console.error('Error in fetchRelatedPosts:', error);
      }
    }

    fetchRelatedPosts();
  }, [post.id, post.category_id]);

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
        <AnimatedElement 
          className="bg-muted/30 py-4"
          animation="fadeIn"
          delay={0.05}
          duration={0.3}
          threshold={0.05}
        >
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
        </AnimatedElement>

        {/* رأس المقال */}
        <AnimatedElement 
          className="py-12 bg-background"
          animation="fadeIn"
          delay={0.1}
          duration={0.3}
          threshold={0.05}
        >
          <header className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* الفئة */}
              <AnimatedElement 
                animation="fadeInUp" 
                delay={0.15}
                duration={0.3}
                threshold={0.05}
              >
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
              </AnimatedElement>

              {/* العنوان */}
              <AnimatedElement 
                animation="fadeInUp" 
                delay={0.2}
                duration={0.3}
                threshold={0.05}
              >
                <h1 className="text-3xl md:text-5xl font-bold font-arabic leading-tight mb-6">
                  {post.title}
                </h1>
              </AnimatedElement>

              {/* المقتطف */}
              {post.excerpt && (
                <AnimatedElement 
                  animation="fadeInUp" 
                  delay={0.25}
                  duration={0.3}
                  threshold={0.05}
                >
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                    {post.excerpt}
                  </p>
                </AnimatedElement>
              )}

              {/* معلومات المقال */}
              <AnimatedContainer
                className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground mb-8"
                staggerChildren={0.05}
                delay={0.3}
                threshold={0.05}
              >
                <AnimatedItem>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                </AnimatedItem>
                
                <AnimatedItem>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="h-4 w-4" />
                    <span>{post.reading_time || 5} دقيقة قراءة</span>
                  </div>
                </AnimatedItem>
                
                <AnimatedItem>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Eye className="h-4 w-4" />
                    <span>{formatArabicNumber(viewCount)} مشاهدة</span>
                  </div>
                </AnimatedItem>
                
                <AnimatedItem>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Heart className="h-4 w-4" />
                    <span>{formatArabicNumber(post.likes_count)} إعجاب</span>
                  </div>
                </AnimatedItem>
              </AnimatedContainer>

              {/* أدوات المشاركة */}
              <AnimatedElement 
                className="flex flex-col sm:flex-row items-center justify-between border-y py-4 mb-8 gap-4"
                animation="fadeInUp" 
                delay={0.35}
                duration={0.3}
                threshold={0.05}
              >
                <ShareButtons post={post} />
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <BookmarkButton 
                    post={{
                      id: post.id,
                      title: post.title,
                      excerpt: post.excerpt || '',
                      slug: post.slug,
                      featured_image: post.featured_image,
                      published_at: post.published_at,
                      reading_time: post.reading_time || 5,
                      view_count: post.view_count,
                      likes_count: post.likes_count,
                      category: post.category
                    }} 
                  />
                  <LikeButton
                    postId={post.id}
                    initialLikesCount={post.likes_count}
                    variant="default"
                  />
                </div>
              </AnimatedElement>
            </div>
          </header>
        </AnimatedElement>

        {/* الصورة الرئيسية */}
        {post.featured_image && (
          <AnimatedElement 
            className="mb-12"
            animation="fadeIn"
            delay={0.4}
            duration={0.4}
            threshold={0.05}
          >
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="relative h-64 sm:h-96 md:h-[500px] rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>
              </div>
            </div>
          </AnimatedElement>
        )}

        {/* المحتوى الرئيسي */}
        <AnimatedElement 
          className="pb-12"
          animation="fadeIn"
          delay={0.45}
          duration={0.3}
          threshold={0.05}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {/* فهرس المحتويات */}
              <AnimatedElement 
                className="lg:col-span-1 order-2 lg:order-1"
                animation="fadeInRight"
                delay={0.5}
                duration={0.3}
                threshold={0.05}
              >
                <div className="sticky top-24">
                  <TableOfContents content={post.content} />
                </div>
              </AnimatedElement>

              {/* المحتوى */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                <AnimatedElement 
                  animation="fadeInUp"
                  delay={0.5}
                  duration={0.3}
                  threshold={0.05}
                >
                  <PostContent content={post.content} />
                </AnimatedElement>
                
                {/* العلامات */}
                {post.tags && post.tags.length > 0 && (
                  <AnimatedElement 
                    className="mt-12 pt-8 border-t"
                    animation="fadeInUp"
                    delay={0.55}
                    duration={0.3}
                    threshold={0.05}
                  >
                    <h3 className="text-lg font-semibold font-arabic mb-4 flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      العلامات
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </AnimatedElement>
                )}

                {/* أدوات نهاية المقال */}
                <AnimatedElement 
                  className="mt-12 pt-8 border-t"
                  animation="fadeInUp"
                  delay={0.6}
                  duration={0.3}
                  threshold={0.05}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-right">
                      <p className="text-muted-foreground mb-2">هل أعجبك هذا المقال؟</p>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <LikeButton
                          postId={post.id}
                          initialLikesCount={post.likes_count}
                          variant="footer"
                        />
                        <ShareButtons post={post} />
                      </div>
                    </div>
                    
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-muted-foreground">
                        آخر تحديث: {formatRelativeTime(post.content_updated_at || post.updated_at)}
                      </p>
                    </div>
                  </div>
                </AnimatedElement>
              </div>
            </div>
          </div>
        </AnimatedElement>

        {/* المقالات ذات الصلة */}
        {relatedPosts.length > 0 && (
          <AnimatedElement 
            className="py-16 bg-muted/30"
            animation="fadeIn"
            delay={0.65}
            duration={0.3}
            threshold={0.05}
          >
            <div className="container mx-auto px-4">
              <RelatedPosts posts={relatedPosts} />
            </div>
          </AnimatedElement>
        )}
      </article>
    </>
  )
} 