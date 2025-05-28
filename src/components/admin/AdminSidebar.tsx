// src/components/admin/AdminSidebar.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card } from '@/components/ui/card'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

const sidebarItems = [
  {
    title: 'لوحة المعلومات',
    href: '/admin/dashboard',
    icon: Icons.dashboard,
  },
  {
    title: 'المقالات',
    href: '/admin/posts',
    icon: Icons.post,
  },
  {
    title: 'التصنيفات',
    href: '/admin/categories',
    icon: Icons.category,
  },
  {
    title: 'الوسائط',
    href: '/admin/media',
    icon: Icons.media,
  },
  {
    title: 'التحليلات',
    href: '/admin/analytics',
    icon: Icons.analytics,
  },
  {
    title: 'الإعدادات',
    href: '/admin/settings',
    icon: Icons.settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-l bg-background">
      <nav className="space-y-2 p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isActive && 'bg-secondary'
                )}
              >
                <Icon className="ml-2 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* إحصائيات سريعة */}
      <Card className="mt-8 p-4">
        <h3 className="font-semibold font-arabic mb-3 text-sm">إحصائيات سريعة</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">المقالات المنشورة</span>
            <span className="font-medium">24</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">المسودات</span>
            <span className="font-medium">7</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">المشاهدات اليوم</span>
            <span className="font-medium">1.2K</span>
          </div>
        </div>
      </Card>
    </aside>
  )
}
