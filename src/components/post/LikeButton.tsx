'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { formatArabicNumber } from '@/lib/utils'
import { 
  hasLikedPost, 
  togglePostLike, 
  updateLikeCount 
} from '@/lib/supabase-client'

// إنشاء كائن للاشتراك في أحداث الإعجاب
export const LikeEventManager = {
  listeners: new Set<(postId: string, isLiked: boolean, count: number) => void>(),
  
  subscribe(callback: (postId: string, isLiked: boolean, count: number) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  },
  
  emit(postId: string, isLiked: boolean, count: number) {
    this.listeners.forEach(callback => callback(postId, isLiked, count));
  }
};

interface LikeButtonProps {
  postId: string
  initialLikesCount: number
  variant?: 'default' | 'footer'
}

export function LikeButton({ 
  postId, 
  initialLikesCount, 
  variant = 'default' 
}: LikeButtonProps) {
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // التحقق من حالة الإعجاب من التخزين المحلي
  useEffect(() => {
    const checkLocalState = () => {
      try {
        // التحقق من حالة الإعجاب
        const liked = hasLikedPost(postId)
        setIsLiked(liked)
        setIsLoading(false)
      } catch (error) {
        console.error('Error checking like status:', error)
        setIsLoading(false)
      }
    }
    
    checkLocalState()
    
    // الاشتراك في أحداث الإعجاب
    const unsubscribe = LikeEventManager.subscribe((likedPostId, liked, count) => {
      if (likedPostId === postId) {
        setIsLiked(liked)
        setLikesCount(count)
      }
    })
    
    return () => {
      unsubscribe()
    }
  }, [postId])

  const handleLikeClick = async () => {
    try {
      setIsLoading(true)
      
      // محاولة تحديث قاعدة البيانات أولاً
      const newCount = await updateLikeCount(postId, !isLiked)
      
      if (newCount !== null) {
        // تم التحديث بنجاح
        const newIsLiked = !isLiked
        
        // تحديث التخزين المحلي
        togglePostLike(postId, newIsLiked)
        
        // تحديث الحالة المحلية
        setIsLiked(newIsLiked)
        setLikesCount(newCount)
        
        // إخطار المكونات الأخرى
        LikeEventManager.emit(postId, newIsLiked, newCount)
        
        // عرض إشعار للمستخدم
        toast({
          title: newIsLiked ? "تم الإعجاب" : "تم إلغاء الإعجاب",
          description: newIsLiked 
            ? "شكراً لإعجابك بهذا المقال" 
            : "تم إلغاء إعجابك بهذا المقال"
        })
      } else {
        // فشل التحديث في قاعدة البيانات
        toast({
          title: "حدث خطأ",
          description: "لم نتمكن من تسجيل تفاعلك، يرجى المحاولة مرة أخرى",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error liking post:', error)
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تسجيل تفاعلك، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // تحديد نوع الأزرار بناءً على المتغير variant
  if (variant === 'footer') {
    return (
      <Button 
        variant={isLiked ? "islamic" : "outline"} 
        size="sm"
        onClick={handleLikeClick}
        disabled={isLoading}
      >
        <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
        أعجبني ({formatArabicNumber(likesCount)})
      </Button>
    )
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleLikeClick}
      disabled={isLoading}
    >
      <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
      {isLiked ? 'معجب' : 'أعجبني'}
    </Button>
  )
} 