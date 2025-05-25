// src/app/admin/posts/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  Calendar,
  FileText
} from 'lucide-react'
import { supabase } from '@/app/lib/supabase'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { PostDeleteDialog } from '@/components/admin/PostDeleteDialog'
import { PostFilters } from '@/components/admin/PostFilters'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
  published_at: string | null
  view_count: number
  reading_time: number
  category?: {
    name: string
    color: string
  }
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deletePost, setDeletePost] = useState<Post | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [statusFilter])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          status,
          created_at,
          updated_at,
          published_at,
          view_count,
          reading_time,
          categories(name, color)
        `)
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error

      setPosts(data.map(post => ({
        ...post,
        category: post.categories
      })))
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error

      setPosts(posts.filter(post => post.id !== postId))
      setDeletePost(null)
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: 'مسودة', variant: 'secondary' as const },
      published: { label: 'منشور', variant: 'default' as const },
      archived: { label: 'أرشيف', variant: 'outline' as const }
    }
    return statusMap[status] || statusMap.draft
  }

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-arabic">إدارة المقالات</h1>
          <p className="text-muted-foreground">
            إنشاء وتحرير وإدارة مقالات المدونة
          </p>
        </div>
        
        <Link href="/admin/posts/new">
          <Button variant="islamic" size="lg" className="font-arabic">
            <Plus className="mr-2 h-5 w-5" />
            مقال جديد
          </Button>
        </Link>
      </div>

      {/* شريط البحث والفلاتر */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في المقالات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <PostFilters 
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
            />
          </div>
        </CardContent>
      </Card>

      {/* جدول المقالات */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">
            المقالات ({filteredPosts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">جاري التحميل...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-right">المشاهدات</TableHead>
                  <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium font-arabic line-clamp-1">
                          {post.title}
                        </div>
                        {post.excerpt && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {post.excerpt}
                          </div>
                        )}
                        <div className="flex items-center space-x-2 space-x-reverse text-xs text-muted-foreground">
                          <span>{post.reading_time} دقيقة</span>
                          <span>•</span>
                          <span>/posts/{post.slug}</span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={getStatusBadge(post.status).variant}>
                        {getStatusBadge(post.status).label}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      {post.category && (
                        <Badge 
                          variant="outline"
                          style={{ 
                            borderColor: post.category.color,
                            color: post.category.color 
                          }}
                        >
                          {post.category.name}
                        </Badge>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{post.view_count}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {formatDate(post.created_at)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatRelativeTime(post.created_at)}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="font-arabic">
                          <DropdownMenuItem asChild>
                            <Link href={`/posts/${post.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              معاينة
                            </Link>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/posts/${post.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              تحرير
                            </Link>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(`/posts/${post.slug}`)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            نسخ الرابط
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => setDeletePost(post)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold font-arabic mb-2">
                لا توجد مقالات
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'لا توجد نتائج للبحث المحدد' : 'ابدأ بإنشاء مقالك الأول'}
              </p>
              {!searchQuery && (
                <Link href="/admin/posts/new">
                  <Button variant="islamic">
                    <Plus className="mr-2 h-4 w-4" />
                    إنشاء مقال جديد
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* مربع حوار الحذف */}
      <PostDeleteDialog
        post={deletePost}
        isOpen={!!deletePost}
        onClose={() => setDeletePost(null)}
        onConfirm={() => deletePost && handleDeletePost(deletePost.id)}
      />
    </div>
  )
}
