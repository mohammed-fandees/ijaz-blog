"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { CategoriesTable } from '@/components/admin/CategoriesTable'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

export default function CategoriesClient() {
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
        <h2 className="text-3xl font-bold tracking-tight">إدارة التصنيفات</h2>
        <Button>
          <Icons.category className="ml-2 h-4 w-4" />
          إضافة تصنيف جديد
        </Button>
      </div>

      <CategoriesTable />
    </div>
  )
} 