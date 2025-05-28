'use client'

import React from 'react'
import { PostCard } from './PostCard'
import { AnimatedContainer, AnimatedItem } from '@/components/ui/animated-element'
import { Post } from '@/types/post'

interface PostResultsProps {
  posts: Post[]
  isLoading?: boolean
}

export default function PostResults({ posts, isLoading }: PostResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg h-48 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <AnimatedContainer 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
      staggerChildren={0.05}
      threshold={0.05}
    >
      {posts.map((post) => (
        <AnimatedItem key={post.id} animation="fadeInUp">
          <PostCard
            post={{
              id: post.id,
              title: post.title,
              excerpt: post.excerpt,
              slug: post.slug,
              featured_image: post.featured_image,
              published_at: post.published_at,
              reading_time: post.reading_time,
              view_count: post.view_count,
              likes_count: post.likes_count,
              category: post.category,
              tags: post.tags,
            }}
          />
        </AnimatedItem>
      ))}
    </AnimatedContainer>
  )
}
