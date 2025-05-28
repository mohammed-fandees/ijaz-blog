// src/components/layout/Header.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { 
  Search, 
  Menu,
  BookOpen,
  Home,
  FolderTree,
  Archive as ArchiveIcon,
  Info,
  Mail,
  X,
  ChevronDown,
  GraduationCap,
  BookText,
  Lightbulb,
  Newspaper,
  Star,
  Users,
  ScrollText,
  BookMarked,
  Bookmark
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { SearchDialog } from '@/components/search/SearchDialog'
import { usePathname } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mainNavItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { 
    href: '#articles',
    label: 'المقالات',
    icon: BookText,
    children: [
      { href: '/articles/science', label: 'الإعجاز العلمي', icon: GraduationCap },
      { href: '/articles/numeric', label: 'الإعجاز العددي', icon: Lightbulb },
      { href: '/articles/linguistic', label: 'الإعجاز اللغوي', icon: ScrollText },
      { href: '/articles/news', label: 'أخبار وتحليلات', icon: Newspaper },
    ]
  },
  { 
    href: '#encyclopedia',
    label: 'الموسوعة',
    icon: BookMarked,
    children: [
      { href: '/encyclopedia/miracles', label: 'معجزات القرآن', icon: Star },
      { href: '/encyclopedia/scholars', label: 'علماء الإعجاز', icon: Users },
      { href: '/encyclopedia/research', label: 'أبحاث علمية', icon: GraduationCap },
    ]
  },
  { href: '/categories', label: 'التصنيفات', icon: FolderTree },
  { href: '/archive', label: 'الأرشيف', icon: ArchiveIcon },
  { href: '/bookmarks', label: 'المحفوظات', icon: Bookmark },
  { href: '/about', label: 'حول المدونة', icon: Info },
  { href: '/contact', label: 'اتصل بنا', icon: Mail },
]

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const NavLink = ({ 
    href, 
    label, 
    icon: Icon, 
    isMobile = false,
    children 
  }: { 
    href: string
    label: string
    icon: React.ElementType
    isMobile?: boolean
    children?: Array<{
      href: string
      label: string
      icon: React.ElementType
    }>
  }) => {
    const isActive = pathname === href || (children?.some(child => pathname === child.href))

    if (children) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center space-x-2 space-x-reverse px-3 py-2 text-sm font-medium transition-colors rounded-md",
                isActive 
                  ? "text-islamic-primary bg-islamic-primary/10" 
                  : "hover:text-islamic-primary hover:bg-islamic-primary/5",
                isMobile && "w-full justify-between"
              )}
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {children.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  href={item.href}
                  className="flex items-center space-x-2 space-x-reverse px-2 py-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Link 
        href={href} 
        className={cn(
          "flex items-center space-x-2 space-x-reverse px-3 py-2 text-sm font-medium transition-colors rounded-md",
          isActive 
            ? "text-islamic-primary bg-islamic-primary/10" 
            : "hover:text-islamic-primary hover:bg-islamic-primary/5",
          isMobile && "w-full"
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
        isScrolled && "shadow-md"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* شعار الموقع */}
        <Link 
          href="/" 
          className="flex items-center space-x-4 space-x-reverse transition-transform hover:scale-105"
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-islamic-primary text-white shadow-lg shadow-islamic-primary/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold font-arabic text-islamic-primary">
              إعجاز
            </span>
          </div>
        </Link>

        {/* التنقل الرئيسي */}
        <nav className="hidden lg:flex items-center space-x-1 space-x-reverse">
          {mainNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* أدوات الهيدر */}
        <div className="flex items-center space-x-4 space-x-reverse">
          {/* زر المحفوظات */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-islamic-primary/5 transition-colors"
            asChild
          >
            <Link href="/bookmarks">
              <Bookmark className="h-4 w-4" />
              <span className="sr-only">المحفوظات</span>
            </Link>
          </Button>
          
          {/* زر البحث */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className="h-9 w-9 hover:bg-islamic-primary/5 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">بحث</span>
          </Button>

          {/* تبديل الوضع الليلي */}
          <ThemeToggle />

          {/* قائمة الجوال */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 hover:bg-islamic-primary/5 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
                <span className="sr-only">القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
              <div className="flex flex-col h-full py-4">
                <div className="px-4 mb-8">
                  <Link 
                    href="/" 
                    className="flex items-center space-x-4 space-x-reverse" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-islamic-primary text-white shadow-lg shadow-islamic-primary/20">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <span className="text-2xl font-bold font-arabic text-islamic-primary">
                        إعجاز
                      </span>
                    </div>
                  </Link>
                </div>

                {/* البحث في الشريط الجانبي */}
                <div className="px-4 mb-6">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-right"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsSearchOpen(true)
                    }}
                  >
                    <Search className="h-4 w-4 ml-2" />
                    بحث في المقالات
                  </Button>
                </div>

                {/* التنقل في الشريط الجانبي */}
                <div className="flex-1 overflow-y-auto px-2">
                  <nav className="flex flex-col space-y-1">
                    {mainNavItems.map((item) => (
                      <div key={item.href} onClick={() => !item.children && setIsMobileMenuOpen(false)}>
                        <NavLink {...item} isMobile />
                      </div>
                    ))}
                  </nav>
                </div>

                {/* تذييل الشريط الجانبي */}
                <div className="mt-auto px-4 py-4 border-t">
                  <div className="flex items-center justify-between">
                    <ThemeToggle />
                    <span className="text-sm text-muted-foreground">
                      © 2024 إعجاز
                    </span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
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
