// src/components/layout/Header.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
import { 
  Search, 
  // Moon, 
  // Sun, 
  // Settings, 
  Menu,
  BookOpen,
  Home
} from 'lucide-react'
import { useSettingsStore } from '@/store/useSettingsStore'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { SearchDialog } from '@/components/search/SearchDialog'

export function Header() {
  const { isDarkMode, setDarkMode } = useSettingsStore()
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* شعار الموقع */}
        <Link href="/" className="flex items-center space-x-2 space-x-reverse">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-islamic-primary text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold font-arabic text-islamic-primary">
            إعجاز
          </span>
        </Link>

        {/* التنقل الرئيسي */}
        <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
          <Link 
            href="/" 
            className="flex items-center space-x-2 space-x-reverse text-sm font-medium transition-colors hover:text-islamic-primary"
          >
            <Home className="h-4 w-4" />
            <span>الرئيسية</span>
          </Link>
          <Link 
            href="/categories" 
            className="text-sm font-medium transition-colors hover:text-islamic-primary"
          >
            الفئات
          </Link>
          <Link 
            href="/archive" 
            className="text-sm font-medium transition-colors hover:text-islamic-primary"
          >
            الأرشيف
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-medium transition-colors hover:text-islamic-primary"
          >
            حول المدونة
          </Link>
          <Link 
            href="/contact" 
            className="text-sm font-medium transition-colors hover:text-islamic-primary"
          >
            اتصل بنا
          </Link>
        </nav>

        {/* أدوات الهيدر */}
        <div className="flex items-center space-x-4 space-x-reverse">
          {/* زر البحث */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className="h-9 w-9"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">بحث</span>
          </Button>

          {/* تبديل الوضع الليلي */}
          <ThemeToggle />

          {/* قائمة الجوال */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">القائمة</span>
          </Button>
        </div>
      </div>

      {/* مربع حوار البحث */}
      <SearchDialog 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </header>
  )
}
