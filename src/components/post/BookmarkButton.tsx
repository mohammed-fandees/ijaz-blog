'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useSavedPosts, SavedPost } from '@/lib/hooks/useSavedPosts'

interface BookmarkButtonProps {
  post: SavedPost
}

export function BookmarkButton({ post }: BookmarkButtonProps) {
  const { isPostSaved, toggleSavePost } = useSavedPosts()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // التحقق من حالة الحفظ
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsBookmarked(isPostSaved(post.id))
      setIsLoading(false)
    }
  }, [post.id, isPostSaved])

  const handleBookmarkClick = () => {
    try {
      const success = toggleSavePost(post)
      
      if (success) {
        const newIsBookmarked = !isBookmarked
        setIsBookmarked(newIsBookmarked)
        
        if (newIsBookmarked) {
          toast({
            title: "تم الحفظ",
            description: "تم حفظ المقال في المحفوظات"
          })
        } else {
          toast({
            title: "تم إلغاء الحفظ",
            description: "تم إزالة المقال من المحفوظات"
          })
        }
      }
    } catch (error) {
      console.error('Error bookmarking post:', error)
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من حفظ المقال، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      })
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleBookmarkClick}
      disabled={isLoading}
    >
      <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
      {isBookmarked ? 'محفوظ' : 'حفظ'}
    </Button>
  )
} 