'use client'

import React, { useEffect, useState } from 'react'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { supabase } from '@/app/lib/supabase'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import Link from 'next/link'

type Post = {
  id: string
  title: string
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  view_count: number
}

export function PostsTable() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, status, published_at, view_count')
        .order('created_at', { ascending: false })
      if (error) {
        setError('حدث خطأ أثناء جلب المقالات')
        setPosts([])
      } else {
        setPosts(data || [])
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>العنوان</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>تاريخ النشر</TableHead>
          <TableHead>المشاهدات</TableHead>
          <TableHead>الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              جاري تحميل المقالات...
            </TableCell>
          </TableRow>
        ) : error ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-red-500">
              {error}
            </TableCell>
          </TableRow>
        ) : posts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              لا توجد مقالات بعد
            </TableCell>
          </TableRow>
        ) : (
          posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-arabic font-bold">
                <Link href={`/posts/${post.id}`} className="hover:underline">{post.title}</Link>
              </TableCell>
              <TableCell>
                {post.status === 'published' ? 'منشور' : post.status === 'draft' ? 'مسودة' : 'أرشيف'}
              </TableCell>
              <TableCell>
                {post.published_at ? new Date(post.published_at).toLocaleDateString('ar-EG') : '-'}
              </TableCell>
              <TableCell>{post.view_count ?? 0}</TableCell>
              <TableCell>
                <Link href={`/admin/posts/${post.id}/edit`}>
                  <Button size="sm" variant="outline" className="mr-2"><Icons.edit className="w-4 h-4" />تعديل</Button>
                </Link>
                <Link href={`/posts/${post.id}`} target="_blank">
                  <Button size="sm" variant="ghost"><Icons.view className="w-4 h-4" />عرض</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}