'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Bookmark } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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

interface LikeBookmarkButtonsProps {
  postId: string
  initialLikesCount: number
  variant?: 'default' | 'header' | 'footer'
}

export function LikeBookmarkButtons({ 
  postId, 
  initialLikesCount, 
  variant = 'default' 
}: LikeBookmarkButtonsProps) {
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  // التحقق من حالة الإعجاب والحفظ من التخزين المحلي
  useEffect(() => {
    const checkLocalInteractions = () => {
      try {
        // استخدام localStorage للتخزين
        if (typeof window !== 'undefined') {
          // التحقق من الإعجاب
          const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
          const isPostLiked = likedPosts.includes(postId);
          
          // التحقق من الحفظ
          const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
          const isPostBookmarked = bookmarkedPosts.includes(postId);
          
          setIsLiked(isPostLiked);
          setIsBookmarked(isPostBookmarked);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking local interactions:', error);
        setIsLoading(false);
      }
    };
    
    checkLocalInteractions();
    
    // الاشتراك في أحداث الإعجاب
    const unsubscribe = LikeEventManager.subscribe((likedPostId, liked, count) => {
      if (likedPostId === postId) {
        setIsLiked(liked);
        setLikesCount(count);
      }
    });
    
    return unsubscribe;
  }, [postId]);

  // دالة لتحديث عدد الإعجابات في قاعدة البيانات
  const updateLikeCountInDatabase = async (newCount: number) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ likes_count: newCount })
        .eq('id', postId);
      
      if (error) {
        console.error('Error updating like count in database:', error);
        throw error;
      }
      
      console.log(`Successfully updated likes_count to ${newCount} for post ${postId}`);
      return true;
    } catch (error) {
      console.error('Error in updateLikeCountInDatabase:', error);
      return false;
    }
  };

  const handleLikeClick = async () => {
    try {
      setIsLoading(true);
      const newIsLiked = !isLiked;
      const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;
      
      if (isLiked) {
        // إلغاء الإعجاب
        // 1. تحديث التخزين المحلي
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        const updatedLikedPosts = likedPosts.filter((id: string) => id !== postId);
        localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
        
        // 2. تحديث الحالة المحلية
        setIsLiked(false);
        setLikesCount(newLikesCount);
        
        // 3. إخطار جميع المكونات الأخرى
        LikeEventManager.emit(postId, false, newLikesCount);
        
        // 4. تحديث قاعدة البيانات - تنفيذ التحديث بشكل منفصل
        const updated = await updateLikeCountInDatabase(newLikesCount);
        
        if (updated) {
          toast({
            title: "تم إلغاء الإعجاب",
            description: "تم إلغاء إعجابك بهذا المقال"
          });
        } else {
          toast({
            title: "تحذير",
            description: "تم إلغاء الإعجاب محلياً ولكن قد يكون هناك مشكلة في تحديث قاعدة البيانات",
            variant: "destructive"
          });
        }
      } else {
        // إضافة إعجاب
        // 1. تحديث التخزين المحلي
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        likedPosts.push(postId);
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
        
        // 2. تحديث الحالة المحلية
        setIsLiked(true);
        setLikesCount(newLikesCount);
        
        // 3. إخطار جميع المكونات الأخرى
        LikeEventManager.emit(postId, true, newLikesCount);
        
        // 4. تحديث قاعدة البيانات - تنفيذ التحديث بشكل منفصل
        const updated = await updateLikeCountInDatabase(newLikesCount);
        
        if (updated) {
          toast({
            title: "تم الإعجاب",
            description: "شكراً لإعجابك بهذا المقال"
          });
        } else {
          toast({
            title: "تحذير",
            description: "تم تسجيل الإعجاب محلياً ولكن قد يكون هناك مشكلة في تحديث قاعدة البيانات",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تسجيل تفاعلك، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkClick = async () => {
    try {
      if (isBookmarked) {
        // إلغاء الحفظ
        // تحديث التخزين المحلي
        const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
        const updatedBookmarkedPosts = bookmarkedPosts.filter((id: string) => id !== postId);
        localStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarkedPosts));
        
        setIsBookmarked(false);
        
        toast({
          title: "تم إلغاء الحفظ",
          description: "تم إزالة المقال من المحفوظات"
        });
      } else {
        // إضافة للمحفوظات
        // تحديث التخزين المحلي
        const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
        bookmarkedPosts.push(postId);
        localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarkedPosts));
        
        setIsBookmarked(true);
        
        toast({
          title: "تم الحفظ",
          description: "تم حفظ المقال في المحفوظات"
        });
      }
    } catch (error) {
      console.error('Error bookmarking post:', error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من حفظ المقال، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  // تحديد نوع الأزرار بناءً على المتغير variant
  if (variant === 'footer') {
    return (
      <div className="flex items-center space-x-2 space-x-reverse">
        <Button 
          variant={isLiked ? "islamic" : "outline"} 
          size="sm"
          onClick={handleLikeClick}
          disabled={isLoading}
        >
          <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
          أعجبني ({likesCount})
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 space-x-reverse">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleBookmarkClick}
        disabled={isLoading}
      >
        <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
        {isBookmarked ? 'محفوظ' : 'حفظ'}
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleLikeClick}
        disabled={isLoading}
      >
        <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
        {isLiked ? 'معجب' : 'أعجبني'}
      </Button>
    </div>
  )
} 