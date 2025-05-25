// src/components/post/RelatedPosts.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Eye, ArrowLeft } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface RelatedPost {
  id: string
  title: string
  excerpt: string
  slug: string
  featured_image?: string
  published_at: string
  reading_time: number
  view_count: number
  category?: {
    name: string
    color: string
    slug: string
  }
}

interface RelatedPostsProps {
  posts: RelatedPost[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts.length) return null

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold font-arabic">مقالات ذات صلة</h2>
        <div className="h-px flex-1 bg-border mr-6"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            {/* صورة المقال */}
            {post.featured_image && (
              <div className="relative h-48 overflow-hidden">
                <Link href={`/posts/${post.slug}`}>
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                
                {/* شارة الفئة */}
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
              {/* الفئة (إذا لم تكن هناك صورة) */}
              {post.category && !post.featured_image && (
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
                <h3 className="font-bold font-arabic text-lg mb-3 line-clamp-2 hover:text-islamic-primary transition-colors group-hover:text-islamic-primary">
                  {post.title}
                </h3>
              </Link>

              {/* المقتطف */}
              {post.excerpt && (
                <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed text-sm">
                  {post.excerpt}
                </p>
              )}

              {/* معلومات المقال */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="flex items-center space-x-1 space-x-reverse">
                    <Clock className="h-3 w-3" />
                    <span>{post.reading_time} دقيقة</span>
                  </span>
                  
                  <span className="flex items-center space-x-1 space-x-reverse">
                    <Eye className="h-3 w-3" />
                    <span>{post.view_count}</span>
                  </span>
                </div>
                
                <span>{formatRelativeTime(post.published_at)}</span>
              </div>

              {/* زر القراءة */}
              <Link href={`/posts/${post.slug}`}>
                <div className="flex items-center justify-between group-hover:text-islamic-primary transition-colors">
                  <span className="text-sm font-medium font-arabic">اقرأ المزيد</span>
                  <ArrowLeft className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* رابط لمزيد من المقالات */}
      <div className="text-center mt-8">
        <Link href="/posts">
          <div className="inline-flex items-center text-islamic-primary hover:text-islamic-primary/80 transition-colors font-arabic">
            <span className="ml-2">استكشف المزيد من المقالات</span>
            <ArrowLeft className="h-4 w-4" />
          </div>
        </Link>
      </div>
    </div>
  )
}
