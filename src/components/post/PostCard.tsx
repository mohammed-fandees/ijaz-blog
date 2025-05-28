// src/components/post/PostCard.tsx
'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark,
  Calendar
} from 'lucide-react'
import { formatRelativeTime, truncateText, formatArabicNumber } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { useSavedPosts, SavedPost } from '@/lib/hooks/useSavedPosts'

interface PostCardProps {
  post: {
    id: string
    title: string
    excerpt: string
    slug: string
    featured_image?: string
    published_at: string
    reading_time: number
    view_count: number
    likes_count: number
    category?: {
      name: string
      color: string
      slug: string
    }
    tags?: string[]
  }
  variant?: 'default' | 'featured' | 'minimal'
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  const isFeatured = variant === 'featured'
  const isMinimal = variant === 'minimal'
  const { isPostSaved, toggleSavePost } = useSavedPosts()

  const handleSave = () => {
    const savedPost: SavedPost = {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      featured_image: post.featured_image,
      published_at: post.published_at,
      reading_time: post.reading_time,
      view_count: post.view_count,
      likes_count: post.likes_count,
      category: post.category
    }
    
    toggleSavePost(savedPost)
    
    toast({
      description: isPostSaved(post.id) 
        ? 'تمت إزالة المقال من المحفوظات' 
        : 'تمت إضافة المقال إلى المحفوظات',
      variant: 'default',
    })
  }

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/posts/${post.slug}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: postUrl,
        })
      } catch (error) {
        console.error('حدث خطأ أثناء المشاركة:', error)
      }
    } else {
      // نسخ الرابط إلى الحافظة إذا كانت واجهة مشاركة الويب غير متوفرة
      navigator.clipboard.writeText(postUrl)
      toast({
        description: 'تم نسخ رابط المقال إلى الحافظة',
        variant: 'default',
      })
    }
  }

  return (
    <Card className={`overflow-hidden border-islamic-primary/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-islamic-primary/30 ${
      isFeatured ? 'md:flex md:flex-row-reverse bg-gradient-to-br from-islamic-primary/5 to-islamic-gold/5' : ''
    }`}>
      {/* صورة المقال */}
      {post.featured_image && !isMinimal && (
        <div className={`relative ${
          isFeatured ? 'md:w-1/2' : 'w-full h-56'
        } ${isFeatured ? 'h-72 md:h-auto' : ''}`}>
          <Link href={`/posts/${post.slug}`}>
            <div className="w-full h-full overflow-hidden">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
            </div>
          </Link>
          
          {/* شارة الفئة */}
          {post.category && (
            <Link href={`/categories/${post.category.slug}`}>
              <Badge 
                className="absolute top-4 right-4 text-white px-3 py-1 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.name}
              </Badge>
            </Link>
          )}
        </div>
      )}

      {/* محتوى المقال */}
      <div className={`${isFeatured ? 'md:w-1/2' : 'w-full'} relative`}>
        {/* زخرفة إسلامية */}
        <div className={`absolute ${isFeatured ? 'top-0 bottom-0 md:right-0 w-1 md:h-full' : 'right-0 top-0 h-1 w-16'} opacity-30`} 
             style={{ background: post.category ? post.category.color : 'var(--islamic-primary)' }}></div>
             
        <CardContent className={`p-6 ${isFeatured ? 'pb-2' : ''}`}>
          {/* الفئة للنسخة المصغرة */}
          {post.category && isMinimal && (
            <Link href={`/categories/${post.category.slug}`}>
              <Badge 
                variant="secondary"
                className="mb-3 hover:opacity-80 transition-opacity"
                style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
              >
                {post.category.name}
              </Badge>
            </Link>
          )}

          {/* عنوان المقال */}
          <Link href={`/posts/${post.slug}`}>
            <h3 className={`font-bold font-arabic line-clamp-2 hover:text-islamic-primary transition-colors ${
              isFeatured ? 'text-2xl mb-4' : 'text-xl mb-3'
            }`}>
              {post.title}
            </h3>
          </Link>

          {/* المقتطف */}
          {post.excerpt && !isMinimal && (
            <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
              {truncateText(post.excerpt, isFeatured ? 200 : 120)}
            </p>
          )}

          {/* التاريخ والإحصائيات */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="flex items-center space-x-1 space-x-reverse">
                <Calendar className="h-4 w-4 text-islamic-primary/70" />
                <span>{formatRelativeTime(post.published_at)}</span>
              </span>
              
              <span className="flex items-center space-x-1 space-x-reverse">
                <Clock className="h-4 w-4 text-islamic-gold/70" />
                <span>{post.reading_time} دقيقة</span>
              </span>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              <span className="flex items-center space-x-1 space-x-reverse">
                <Eye className="h-4 w-4 text-islamic-primary/70" />
                <span>{formatArabicNumber(post.view_count)}</span>
              </span>
              
              <span className="flex items-center space-x-1 space-x-reverse">
                <Heart className="h-4 w-4 text-red-500/70" />
                <span>{formatArabicNumber(post.likes_count)}</span>
              </span>
            </div>
          </div>

          {/* العلامات */}
          {post.tags && post.tags.length > 0 && !isMinimal && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs hover:bg-islamic-gold/10 hover:text-islamic-gold transition-colors">
                  #{tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs hover:bg-islamic-gold/10 hover:text-islamic-gold transition-colors">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        {/* إجراءات المقال */}
        {!isMinimal && (
          <CardFooter className={`p-6 pt-0 ${isFeatured ? 'pb-6' : ''}`}>
            <div className="flex items-center justify-between w-full">
              <Link href={`/posts/${post.slug}`}>
                <Button 
                  variant="islamic" 
                  size="sm"
                  className="group relative overflow-hidden"
                >
                  <span className="relative z-10">اقرأ المقال</span>
                  <span className="absolute inset-0 bg-islamic-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </Link>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:bg-islamic-primary/10 transition-colors" 
                  onClick={handleSave}
                >
                  <Bookmark className={`h-4 w-4 ${isPostSaved(post.id) ? 'fill-islamic-primary text-islamic-primary' : ''}`} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:bg-islamic-primary/10 transition-colors"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </div>
    </Card>
  )
}
