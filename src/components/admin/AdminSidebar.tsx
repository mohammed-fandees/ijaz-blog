// src/components/admin/AdminSidebar.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard,
  FileText,
  FolderOpen,
  BarChart3,
  Settings,
  Users,
  Upload,
  Calendar,
  Tags,
  Bookmark
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    title: 'لوحة التحكم',
    href: '/admin',
    icon: LayoutDashboard,
    badge: null
  },
  {
    title: 'المقالات',
    href: '/admin/posts',
    icon: FileText,
    badge: 'جديد'
  },
  {
    title: 'الفئات',
    href: '/admin/categories',
    icon: FolderOpen,
    badge: null
  },
  {
    title: 'العلامات',
    href: '/admin/tags',
    icon: Tags,
    badge: null
  },
  {
    title: 'الوسائط',
    href: '/admin/media',
    icon: Upload,
    badge: null
  },
  {
    title: 'التحليلات',
    href: '/admin/analytics',
    icon: BarChart3,
    badge: null
  },
  {
    title: 'الإعدادات',
    href: '/admin/settings',
    icon: Settings,
    badge: null
  }
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white shadow-sm border-l h-screen sticky top-0">
      <div className="p-6">
        <Link href="/admin" className="flex items-center space-x-2 space-x-reverse mb-8">
          <div className="w-8 h-8 bg-islamic-primary rounded-lg flex items-center justify-center">
            <Bookmark className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold font-arabic text-islamic-primary">
            لوحة التحكم
          </span>
        </Link>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg transition-colors font-arabic',
                  isActive 
                    ? 'bg-islamic-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </div>
                
                {item.badge && (
                  <Badge 
                    variant={isActive ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
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
      </div>
    </aside>
  )
}
