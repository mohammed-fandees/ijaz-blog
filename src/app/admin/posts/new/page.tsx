"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function AdminNewPostPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/login')
    }
  }, [user, loading, router])

  if (loading) return <div>جاري التحميل...</div>
  if (!user) return null

  // ... باقي الكود الحالي للصفحة ...
} 