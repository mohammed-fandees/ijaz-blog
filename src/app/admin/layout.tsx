// src/app/admin/layout.tsx
import React from 'react'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useAuthStore } from '@/store/useAuthStore'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // يمكن إضافة منطق التحقق من المصادقة هنا
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
