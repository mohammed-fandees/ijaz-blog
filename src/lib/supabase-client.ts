'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SupabaseClient } from '@supabase/supabase-js'

// إنشاء نسخة واحدة من العميل واستخدامها في جميع أنحاء التطبيق
let supabaseClient: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (supabaseClient) return supabaseClient
  
  supabaseClient = createClientComponentClient()
  return supabaseClient
}

// تخزين المشاهدات المحلية
const VIEWED_POSTS_KEY = 'ijaz_viewed_posts'

/**
 * التحقق مما إذا كان المستخدم قد شاهد المقال من قبل
 */
export function hasViewedPost(postId: string): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const viewedPosts = JSON.parse(localStorage.getItem(VIEWED_POSTS_KEY) || '[]')
    return viewedPosts.includes(postId)
  } catch (error) {
    console.error('Error checking viewed post:', error)
    return false
  }
}

/**
 * تسجيل المقال كمشاهد محليًا
 */
export function markPostAsViewed(postId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const viewedPosts = JSON.parse(localStorage.getItem(VIEWED_POSTS_KEY) || '[]')
    if (!viewedPosts.includes(postId)) {
      viewedPosts.push(postId)
      localStorage.setItem(VIEWED_POSTS_KEY, JSON.stringify(viewedPosts))
    }
  } catch (error) {
    console.error('Error marking post as viewed:', error)
  }
}

/**
 * زيادة عدد المشاهدات للمقال
 */
export async function incrementViewCount(postId: string): Promise<number | null> {
  try {
    const supabase = getSupabase()
    
    // زيادة عدد المشاهدات
    const { data, error } = await supabase.rpc('increment_view_count', {
      post_id: postId
    })
    
    if (error) {
      console.error('Error incrementing view count:', error)
      return null
    }
    
    return data as number
  } catch (error) {
    console.error('Error in incrementViewCount:', error)
    return null
  }
}

// دالة للتحقق مما إذا كان المستخدم قد قام بالإعجاب بالمقال
export function hasLikedPost(postId: string): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  
  try {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]')
    return likedPosts.includes(postId)
  } catch (error) {
    console.error('Error checking liked posts:', error)
    return false
  }
}

// دالة لتسجيل إعجاب المستخدم بالمقال
export function markPostAsLiked(postId: string): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]')
    if (!likedPosts.includes(postId)) {
      likedPosts.push(postId)
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
    }
  } catch (error) {
    console.error('Error marking post as liked:', error)
  }
}

// دالة لزيادة عدد الإعجابات
export async function incrementLikeCount(postId: string): Promise<number | null> {
  try {
    const supabase = getSupabase()
    
    const { data, error } = await supabase.rpc('increment_like_count', {
      post_id: postId
    })
    
    if (error) {
      console.error('Error incrementing like count:', error)
      return null
    }
    
    return data as number
  } catch (error) {
    console.error('Error in incrementLikeCount:', error)
    return null
  }
}

// دالة لإلغاء الإعجاب بالمقال
export function removePostLike(postId: string): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]')
    const updatedLikedPosts = likedPosts.filter((id: string) => id !== postId)
    localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts))
  } catch (error) {
    console.error('Error removing post like:', error)
  }
}

// دالة لإنقاص عدد الإعجابات
export async function decrementLikeCount(postId: string): Promise<number | null> {
  try {
    const supabase = getSupabase()
    
    const { data, error } = await supabase.rpc('decrement_like_count', {
      post_id: postId
    })
    
    if (error) {
      console.error('Error decrementing like count:', error)
      return null
    }
    
    return data as number
  } catch (error) {
    console.error('Error in decrementLikeCount:', error)
    return null
  }
}

/**
 * تبديل حالة الإعجاب بمقال
 */
export function togglePostLike(postId: string, isLiked: boolean): void {
  if (isLiked) {
    markPostAsLiked(postId);
  } else {
    removePostLike(postId);
  }
}

/**
 * تحديث عدد الإعجابات
 */
export async function updateLikeCount(postId: string, isLiked: boolean): Promise<number | null> {
  return isLiked 
    ? await incrementLikeCount(postId)
    : await decrementLikeCount(postId);
} 