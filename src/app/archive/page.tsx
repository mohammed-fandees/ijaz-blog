'use client'

// src/app/archive/page.tsx
import React, { useEffect, useState, ReactNode } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/post/PostCard'
import { 
  Calendar, 
  Archive, 
  Clock,
  BookOpen
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { motion, useInView } from 'framer-motion'
import { getSupabase } from '@/lib/supabase-client'

// مكون الحركة المرتبط بالتمرير
function ScrollAnimatedSection({ 
  children, 
  delay = 0, 
  className = "" 
}: { 
  children: ReactNode; 
  delay?: number; 
  className?: string 
}) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  
  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// مكون الحركة للعناصر المتعددة
function ScrollAnimatedItems({ 
  children, 
  staggerDelay = 0.1, 
  className = "" 
}: { 
  children: ReactNode; 
  staggerDelay?: number; 
  className?: string 
}) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// عنصر مفرد للحركة
function ScrollAnimatedItem({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string 
}) {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        show: { 
          y: 0, 
          opacity: 1,
          transition: { duration: 0.5 }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ArchivePost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured_image?: string;
  published_at: string;
  reading_time: number;
  view_count: number;
  likes_count: number;
  tags?: string[];
  categories?: {
    name: string;
    color: string;
    slug: string;
  }[];
  category?: {
    name: string;
    color: string;
    slug: string;
  };
}

interface ArchiveGroup {
  year: number
  months: {
    month: number
    monthName: string
    posts: ArchivePost[]
  }[]
}

interface ArchiveStats {
  totalPosts: number;
  firstPost: string | null;
  yearsActive: number;
}

function getMonthName(month: number): string {
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ]
  return months[month]
}

export default function ArchiveClientPage() {
  const [archiveGroups, setArchiveGroups] = useState<ArchiveGroup[]>([])
  const [stats, setStats] = useState<ArchiveStats>({ totalPosts: 0, firstPost: null, yearsActive: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const supabase = getSupabase()
        
        // Fetch archive data
        const { data: posts, error } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            excerpt,
            slug,
            featured_image,
            published_at,
            reading_time,
            view_count,
            likes_count,
            tags,
            categories(name, color, slug)
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false })

        if (error) {
          console.error('Error fetching archive:', error)
        } else {
          // تجميع المقالات حسب السنة والشهر
          const archive: { [key: string]: { [key: string]: ArchivePost[] } } = {}
          
          posts.forEach(post => {
            const date = new Date(post.published_at)
            const year = date.getFullYear()
            const month = date.getMonth()
            
            if (!archive[year]) {
              archive[year] = {}
            }
            
            if (!archive[year][month]) {
              archive[year][month] = []
            }
            
            archive[year][month].push({
              ...post,
              category: post.categories ? post.categories[0] : undefined
            })
          })

          // تحويل إلى تنسيق منظم
          const groups: ArchiveGroup[] = Object.keys(archive)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map(year => ({
              year: parseInt(year),
              months: Object.keys(archive[year])
                .sort((a, b) => parseInt(b) - parseInt(a))
                .map(month => ({
                  month: parseInt(month),
                  monthName: getMonthName(parseInt(month)),
                  posts: archive[year][month]
                }))
            }))

          setArchiveGroups(groups)

          // Calcular estadísticas
          if (posts.length > 0) {
            const years = new Set(posts.map(post => 
              new Date(post.published_at).getFullYear()
            ))

            const firstPost = posts.reduce((oldest, post) => 
              new Date(post.published_at) < new Date(oldest.published_at) ? post : oldest,
              posts[0]
            )

            setStats({
              totalPosts: posts.length,
              firstPost: firstPost.published_at,
              yearsActive: years.size
            })
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* رأس الصفحة */}
        <ScrollAnimatedSection delay={0.1}>
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-islamic-primary/10 text-islamic-primary mb-6">
              <Archive className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold font-arabic text-islamic-primary mb-4">
              أرشيف المقالات
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              استعرض جميع مقالاتنا مرتبة حسب تاريخ النشر
            </p>
          </div>
        </ScrollAnimatedSection>

        {/* إحصائيات الأرشيف */}
        <ScrollAnimatedItems className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" staggerDelay={0.15}>
          <ScrollAnimatedItem>
            <Card className="overflow-hidden border-islamic-primary/10 hover:border-islamic-primary/30 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-islamic-primary/10 text-islamic-primary flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-islamic-primary mb-2">
                  {stats.totalPosts}
                </div>
                <div className="text-muted-foreground font-arabic">مقال منشور</div>
              </CardContent>
            </Card>
          </ScrollAnimatedItem>
          
          <ScrollAnimatedItem>
            <Card className="overflow-hidden border-islamic-gold/10 hover:border-islamic-gold/30 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-islamic-gold/10 text-islamic-gold flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-islamic-gold mb-2">
                  {stats.yearsActive}
                </div>
                <div className="text-muted-foreground font-arabic">سنوات من العطاء</div>
              </CardContent>
            </Card>
          </ScrollAnimatedItem>
          
          <ScrollAnimatedItem>
            <Card className="overflow-hidden border-islamic-primary/10 hover:border-islamic-primary/30 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-islamic-primary/10 text-islamic-primary flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="text-xl font-medium text-islamic-primary mb-2">
                  {stats.firstPost ? formatDate(stats.firstPost) : 'غير محدد'}
                </div>
                <div className="text-muted-foreground font-arabic">أول مقال</div>
              </CardContent>
            </Card>
          </ScrollAnimatedItem>
        </ScrollAnimatedItems>

        {/* الأرشيف */}
        <div className="space-y-16">
          {archiveGroups.map((yearGroup, yearIndex) => (
            <ScrollAnimatedSection key={yearGroup.year} delay={0.1 + yearIndex * 0.05} className="space-y-8">
              {/* عنوان السنة */}
              <div className="flex items-center mb-10">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-islamic-primary text-white font-bold text-xl">
                  {yearGroup.year}
                </div>
                <div className="mr-4 flex-1">
                  <h2 className="text-2xl font-bold font-arabic">
                    مقالات عام {yearGroup.year}
                  </h2>
                  <div className="h-px bg-border mt-2 w-full"></div>
                </div>
              </div>

              {/* الأشهر */}
              <div className="space-y-12">
                {yearGroup.months.map((monthGroup, monthIndex) => (
                  <div key={`${yearGroup.year}-${monthGroup.month}`}>
                    {/* عنوان الشهر */}
                    <ScrollAnimatedSection delay={0.05 * monthIndex} className="mb-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-islamic-gold/10 flex items-center justify-center text-islamic-gold">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-semibold font-arabic text-islamic-gold mr-3">
                          {monthGroup.monthName} {yearGroup.year}
                        </h3>
                        <Badge variant="secondary" className="mr-3 font-arabic">
                          {monthGroup.posts.length} مقال
                        </Badge>
                        <div className="h-px bg-border flex-grow"></div>
                      </div>
                    </ScrollAnimatedSection>

                    {/* المقالات */}
                    <ScrollAnimatedItems className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.05}>
                      {monthGroup.posts.map((post) => (
                        <ScrollAnimatedItem key={post.id}>
                          <PostCard 
                            post={post}
                            variant="minimal"
                          />
                        </ScrollAnimatedItem>
                      ))}
                    </ScrollAnimatedItems>
                  </div>
                ))}
              </div>
            </ScrollAnimatedSection>
          ))}
        </div>

        {/* رسالة إذا كان الأرشيف فارغ */}
        {archiveGroups.length === 0 && (
          <ScrollAnimatedSection delay={0.2}>
            <div className="text-center py-16 bg-muted/10 rounded-xl border border-border/50">
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-6">
                <Archive className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold font-arabic mb-4">
                لا توجد مقالات في الأرشيف حالياً
              </h3>
              <p className="text-muted-foreground mb-6">
                سيتم إضافة المقالات هنا بمجرد نشرها
              </p>
              
              <Link href="/posts">
                <Button variant="islamic" className="font-arabic">
                  <BookOpen className="mr-2 h-4 w-4" />
                  تصفح المقالات
                </Button>
              </Link>
            </div>
          </ScrollAnimatedSection>
        )}
      </div>
    </div>
  )
}
