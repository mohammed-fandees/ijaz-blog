// src/app/archive/page.tsx
import React from 'react'
import Link from 'next/link'
import { createServerSideSupabase } from '@/app/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/post/PostCard'
import { 
  Calendar, 
  Archive, 
  ChevronRight,
  Clock,
  BookOpen
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'أرشيف المقالات | إعجاز',
  description: 'استعرض جميع مقالات مدونة إعجاز مرتبة حسب التاريخ',
}

interface ArchiveGroup {
  year: number
  months: {
    month: number
    monthName: string
    posts: any[]
  }[]
}

async function getArchiveData() {
  const supabase = createServerSideSupabase()
  
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
    return []
  }

  // تجميع المقالات حسب السنة والشهر
  const archive: { [key: string]: { [key: string]: any[] } } = {}
  
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
      category: post.categories
    })
  })

  // تحويل إلى تنسيق منظم
  const archiveGroups: ArchiveGroup[] = Object.keys(archive)
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

  return archiveGroups
}

function getMonthName(month: number): string {
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ]
  return months[month]
}

async function getArchiveStats() {
  const supabase = createServerSideSupabase()
  
  const { data: posts } = await supabase
    .from('posts')
    .select('id, published_at')
    .eq('status', 'published')

  if (!posts) return { totalPosts: 0, firstPost: null, yearsActive: 0 }

  const years = new Set(posts.map(post => 
    new Date(post.published_at).getFullYear()
  ))

  const firstPost = posts.reduce((oldest, post) => 
    new Date(post.published_at) < new Date(oldest.published_at) ? post : oldest
  )

  return {
    totalPosts: posts.length,
    firstPost: firstPost.published_at,
    yearsActive: years.size
  }
}

export default async function ArchivePage() {
  const [archiveGroups, stats] = await Promise.all([
    getArchiveData(),
    getArchiveStats()
  ])

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* رأس الصفحة */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Archive className="h-12 w-12 text-islamic-primary" />
          </div>
          <h1 className="text-4xl font-bold font-arabic text-islamic-primary mb-4">
            أرشيف المقالات
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            استعرض جميع مقالاتنا مرتبة حسب تاريخ النشر
          </p>
        </div>

        {/* إحصائيات الأرشيف */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-islamic-primary mb-2">
                {stats.totalPosts}
              </div>
              <div className="text-muted-foreground font-arabic">مقال منشور</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-islamic-gold mb-2">
                {stats.yearsActive}
              </div>
              <div className="text-muted-foreground font-arabic">سنوات من العطاء</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-lg font-medium text-islamic-primary mb-2">
                {stats.firstPost ? formatDate(stats.firstPost) : 'غير محدد'}
              </div>
              <div className="text-muted-foreground font-arabic">أول مقال</div>
            </CardContent>
          </Card>
        </div>

        {/* الأرشيف */}
        <div className="space-y-12">
          {archiveGroups.map((yearGroup) => (
            <div key={yearGroup.year}>
              {/* عنوان السنة */}
              <div className="flex items-center mb-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-islamic-primary text-white font-bold text-lg">
                  {yearGroup.year}
                </div>
                <div className="mr-4 flex-1">
                  <h2 className="text-2xl font-bold font-arabic">
                    مقالات عام {yearGroup.year}
                  </h2>
                  <div className="h-px bg-border mt-2"></div>
                </div>
              </div>

              {/* الأشهر */}
              <div className="space-y-8">
                {yearGroup.months.map((monthGroup) => (
                  <div key={`${yearGroup.year}-${monthGroup.month}`}>
                    {/* عنوان الشهر */}
                    <div className="flex items-center mb-6">
                      <Calendar className="h-5 w-5 text-islamic-gold mr-3" />
                      <h3 className="text-xl font-semibold font-arabic text-islamic-gold">
                        {monthGroup.monthName} {yearGroup.year}
                      </h3>
                      <Badge variant="secondary" className="mr-3 font-arabic">
                        {monthGroup.posts.length} مقال
                      </Badge>
                    </div>

                    {/* المقالات */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {monthGroup.posts.map((post) => (
                        <PostCard 
                          key={post.id} 
                          post={post}
                          variant="minimal"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* رسالة إذا كان الأرشيف فارغ */}
        {archiveGroups.length === 0 && (
          <div className="text-center py-16">
            <Archive className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
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
        )}

        {/* روابط إضافية */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-islamic-primary/5 to-islamic-gold/5 p-8 rounded-xl">
            <h2 className="text-xl font-bold font-arabic mb-4">
              استكشف المزيد
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories">
                <Button variant="outline" className="font-arabic">
                  تصفح الفئات
                </Button>
              </Link>
              
              <Link href="/posts">
                <Button variant="islamic" className="font-arabic">
                  أحدث المقالات
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
