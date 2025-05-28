import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

const recentPosts = [
  {
    id: '1',
    title: 'الإعجاز العلمي في القرآن الكريم',
    excerpt: 'دراسة تحليلية للإعجاز العلمي في القرآن الكريم وارتباطه بالاكتشافات الحديثة',
    status: 'published',
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '2',
    title: 'معجزات النبي محمد ﷺ',
    excerpt: 'استعراض لأهم معجزات النبي محمد ﷺ وتأثيرها على نشر الدعوة الإسلامية',
    status: 'draft',
    createdAt: new Date('2024-03-09'),
  },
  {
    id: '3',
    title: 'الإعجاز التشريعي في السنة النبوية',
    excerpt: 'بحث في الإعجاز التشريعي في السنة النبوية وأثره في بناء المجتمع المسلم',
    status: 'published',
    createdAt: new Date('2024-03-08'),
  },
]

export function RecentPosts() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {recentPosts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between space-x-4"
          >
            <div className="space-y-1">
              <Link
                href={`/admin/posts/${post.id}`}
                className="font-medium hover:underline"
              >
                {post.title}
              </Link>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>
                  {formatDistanceToNow(post.createdAt, {
                    addSuffix: true,
                    locale: ar,
                  })}
                </span>
                <span>•</span>
                <span
                  className={
                    post.status === 'published'
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }
                >
                  {post.status === 'published' ? 'منشور' : 'مسودة'}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Icons.edit className="h-4 w-4" />
              <span className="sr-only">تعديل المقال</span>
            </Button>
          </div>
        ))}
      </div>
      <Button asChild className="w-full">
        <Link href="/admin/posts">عرض كل المقالات</Link>
      </Button>
    </div>
  )
} 