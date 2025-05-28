// src/app/admin/layout.tsx
'use client'

import { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return children
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
