"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PostsTable } from '@/components/admin/PostsTable'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function PostsClient() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/login')
    }
  }, [user, loading, router])

  if (loading) return <div>جاري التحميل...</div>
  if (!user) return null

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">إدارة المقالات</h2>
        <Button asChild>
          <Link href="/admin/posts/new">
            إضافة مقال جديد
          </Link>
        </Button>
      </div>

      <PostsTable />
    </div>
  )
} 