// src/components/post/PostCard.tsx
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
import { formatRelativeTime, truncateText } from '@/lib/utils'

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

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
      isFeatured ? 'md:flex md:flex-row-reverse' : ''
    }`}>
      {/* صورة المقال */}
      {post.featured_image && !isMinimal && (
        <div className={`relative ${
          isFeatured ? 'md:w-1/2' : 'w-full h-48'
        } ${isFeatured ? 'h-64 md:h-auto' : ''}`}>
          <Link href={`/posts/${post.slug}`}>
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </Link>
          
          {/* شارة الفئة */}
          {post.category && (
            <Badge 
              className="absolute top-4 right-4 text-white"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </Badge>
          )}
        </div>
      )}

      {/* محتوى المقال */}
      <div className={isFeatured ? 'md:w-1/2' : 'w-full'}>
        <CardContent className="p-6">
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
              isFeatured ? 'text-2xl mb-4' : 'text-lg mb-3'
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
                <Calendar className="h-4 w-4" />
                <span>{formatRelativeTime(post.published_at)}</span>
              </span>
              
              <span className="flex items-center space-x-1 space-x-reverse">
                <Clock className="h-4 w-4" />
                <span>{post.reading_time} دقيقة</span>
              </span>
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              <span className="flex items-center space-x-1 space-x-reverse">
                <Eye className="h-4 w-4" />
                <span>{post.view_count}</span>
              </span>
              
              <span className="flex items-center space-x-1 space-x-reverse">
                <Heart className="h-4 w-4" />
                <span>{post.likes_count}</span>
              </span>
            </div>
          </div>

          {/* العلامات */}
          {post.tags && post.tags.length > 0 && !isMinimal && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        {/* إجراءات المقال */}
        {!isMinimal && (
          <CardFooter className="p-6 pt-0">
            <div className="flex items-center justify-between w-full">
              <Link href={`/posts/${post.slug}`}>
                <Button variant="islamic" size="sm">
                  اقرأ المزيد
                </Button>
              </Link>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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
