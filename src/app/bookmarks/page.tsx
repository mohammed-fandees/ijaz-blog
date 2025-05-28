'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSavedPosts } from '@/lib/hooks/useSavedPosts'
import { PostCard } from '@/components/post/PostCard'
import { Button } from '@/components/ui/button'
import { Trash2, Bookmark, BookOpen } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { getSupabase } from '@/lib/supabase-client'
import Link from 'next/link'
import { motion } from 'framer-motion'

// متغيرات الحركة
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
}

// واجهة للإحصائيات المحدثة
interface PostStats {
  id: string;
  view_count: number;
  likes_count: number;
}

export default function BookmarksPage() {
  const { savedPosts, clearSavedPosts, updatePostStats } = useSavedPosts()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [updatedPosts, setUpdatedPosts] = useState(savedPosts)
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)

  // تأكد من أننا في الجانب العميل قبل استدعاء localStorage
  useEffect(() => {
    setMounted(true)
  }, [])

  // تعريف دالة الاستعلام خارج useEffect لتجنب إعادة إنشائها
  const fetchPostsStats = useCallback(async () => {
    // منع إعادة التنفيذ إذا سبق وتم تنفيذ العملية
    if (hasAttemptedFetch) return;
    
    if (savedPosts.length === 0) {
      setIsLoading(false);
      setHasAttemptedFetch(true);
      return;
    }

    try {
      setIsLoading(true);
      const supabase = getSupabase();
      
      // استخراج معرفات المقالات المحفوظة
      const postIds = savedPosts.map(post => post.id);
      
      // استعلام لجلب إحصائيات المقالات
      const { data, error } = await supabase
        .from('posts')
        .select('id, view_count, likes_count')
        .in('id', postIds);
      
      if (error) {
        console.error('Error fetching posts stats:', error);
        setIsLoading(false);
        setHasAttemptedFetch(true);
        return;
      }
      
      if (data && data.length > 0) {
        // تحديث إحصائيات البوستات المحفوظة
        const updatedStats = data as PostStats[];
        const updatedSavedPosts = savedPosts.map(post => {
          const stats = updatedStats.find(stat => stat.id === post.id);
          if (stats) {
            return {
              ...post,
              view_count: stats.view_count,
              likes_count: stats.likes_count
            };
          }
          return post;
        });
        
        // تحديث البوستات المحفوظة بالإحصائيات الجديدة
        updatePostStats(updatedSavedPosts);
        setUpdatedPosts(updatedSavedPosts);
      }
    } catch (error) {
      console.error('Error in fetchPostsStats:', error);
    } finally {
      setIsLoading(false);
      setHasAttemptedFetch(true);
    }
  }, [savedPosts, updatePostStats, hasAttemptedFetch]);

  // تنفيذ الاستعلام مرة واحدة فقط عند تهيئة المكون
  useEffect(() => {
    if (mounted && !hasAttemptedFetch) {
      fetchPostsStats();
    } else if (mounted && !isLoading && savedPosts.length > 0) {
      setUpdatedPosts(savedPosts);
    }
  }, [mounted, fetchPostsStats, hasAttemptedFetch, isLoading, savedPosts]);

  const handleClearBookmarks = () => {
    clearSavedPosts()
    setUpdatedPosts([])
    toast({
      description: 'تم مسح جميع المقالات المحفوظة',
      variant: 'default',
    })
  }

  // لا تقم بالتصيير حتى يتم تحميل البيانات من localStorage
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* رأس الصفحة */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 rounded-full bg-islamic-primary/10 text-islamic-primary mb-6">
            <Bookmark className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold font-arabic text-islamic-primary mb-4">
            المحفوظات
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
            استعرض المقالات التي قمت بحفظها للرجوع إليها لاحقاً
          </p>
          
          {savedPosts.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  مسح الكل
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="font-arabic">
                <AlertDialogHeader>
                  <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                  <AlertDialogDescription>
                    سيتم حذف جميع المقالات المحفوظة. هذا الإجراء لا يمكن التراجع عنه.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearBookmarks}>نعم، امسح الكل</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-primary"></div>
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="text-center py-16 bg-muted/10 rounded-xl border border-border/50">
            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-6">
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-4 font-arabic">لا توجد مقالات محفوظة</h2>
            <p className="text-muted-foreground mb-6 font-arabic">
              يمكنك حفظ المقالات التي تهمك للرجوع إليها لاحقاً بالضغط على أيقونة الحفظ
            </p>
            <Button variant="islamic" asChild>
              <Link href="/" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                تصفح المقالات
              </Link>
            </Button>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {updatedPosts.map((post) => (
              <motion.div key={post.id} variants={item}>
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
} 