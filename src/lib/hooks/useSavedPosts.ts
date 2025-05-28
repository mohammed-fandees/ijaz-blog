'use client'

import { useState, useEffect } from 'react'

export interface SavedPost {
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
}

export function useSavedPosts() {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([])
  
  // تحميل المقالات المحفوظة من localStorage عند تهيئة الصفحة
  useEffect(() => {
    const loadSavedPosts = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('savedPosts')
        if (saved) {
          try {
            const parsedPosts = JSON.parse(saved);
            
            // تحديث المقالات المحفوظة القديمة التي قد لا تحتوي على حقول view_count و likes_count
            const updatedPosts = parsedPosts.map((post: SavedPost) => ({
              ...post,
              view_count: post.view_count || 0,
              likes_count: post.likes_count || 0
            }));
            
            setSavedPosts(updatedPosts);
          } catch (error) {
            console.error('فشل في تحميل المقالات المحفوظة:', error)
            localStorage.removeItem('savedPosts')
          }
        }
      }
    }

    loadSavedPosts()
  }, [])

  // حفظ التغييرات في localStorage كلما تغيرت المقالات المحفوظة
  useEffect(() => {
    if (typeof window !== 'undefined' && savedPosts.length > 0) {
      localStorage.setItem('savedPosts', JSON.stringify(savedPosts))
    }
  }, [savedPosts])

  // التحقق مما إذا كان المقال محفوظاً
  const isPostSaved = (postId: string): boolean => {
    return savedPosts.some(post => post.id === postId)
  }

  // إضافة مقال إلى المحفوظات
  const savePost = (post: SavedPost) => {
    if (!isPostSaved(post.id)) {
      setSavedPosts([...savedPosts, post])
      return true
    }
    return false
  }

  // إزالة مقال من المحفوظات
  const removePost = (postId: string) => {
    const newSavedPosts = savedPosts.filter(post => post.id !== postId)
    setSavedPosts(newSavedPosts)
    
    // إزالة من localStorage إذا لم يعد هناك مقالات محفوظة
    if (newSavedPosts.length === 0 && typeof window !== 'undefined') {
      localStorage.removeItem('savedPosts')
    }
    
    return true
  }

  // تبديل حالة الحفظ (إضافة/إزالة)
  const toggleSavePost = (post: SavedPost): boolean => {
    if (isPostSaved(post.id)) {
      return removePost(post.id)
    } else {
      return savePost(post)
    }
  }

  // تنظيف المحفوظات بالكامل
  const clearSavedPosts = () => {
    setSavedPosts([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('savedPosts')
    }
  }

  // تحديث إحصائيات المقالات المحفوظة
  const updatePostStats = (updatedPosts: SavedPost[]) => {
    setSavedPosts(updatedPosts)
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedPosts', JSON.stringify(updatedPosts))
    }
  }

  return {
    savedPosts,
    isPostSaved,
    savePost,
    removePost,
    toggleSavePost,
    clearSavedPosts,
    updatePostStats
  }
} 