"use client"

// src/app/not-found.tsx
import React, { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Search, 
  Home, 
  BookOpen, 
  Compass
} from 'lucide-react'

export default function NotFound() {
  // Set proper metadata for better indexing
  useEffect(() => {
    // Update the document title
    document.title = 'الصفحة غير موجودة | إعجاز'
    
    // Add meta tags for better SEO
    const metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    metaDescription.content = 'الصفحة التي تبحث عنها غير موجودة'
    document.head.appendChild(metaDescription)
    
    // Add noindex meta tag
    const metaRobots = document.createElement('meta')
    metaRobots.name = 'robots'
    metaRobots.content = 'noindex'
    document.head.appendChild(metaRobots)
    
    // Add canonical tag
    const canonicalLink = document.createElement('link')
    canonicalLink.rel = 'canonical'
    canonicalLink.href = `${window.location.origin}/404`
    document.head.appendChild(canonicalLink)
    
    // Cleanup function
    return () => {
      document.head.removeChild(metaDescription)
      document.head.removeChild(metaRobots)
      document.head.removeChild(canonicalLink)
    }
  }, [])

  const suggestions = [
    {
      icon: Home,
      title: 'العودة للرئيسية',
      description: 'ابدأ من جديد من الصفحة الرئيسية',
      href: '/',
      color: 'bg-islamic-primary'
    },
    {
      icon: BookOpen,
      title: 'تصفح المقالات',
      description: 'اكتشف أحدث المقالات والبحوث',
      href: '/posts',
      color: 'bg-islamic-gold'
    },
    {
      icon: Search,
      title: 'البحث',
      description: 'ابحث عن المحتوى الذي تريده',
      href: '/search',
      color: 'bg-green-600'
    },
    {
      icon: Compass,
      title: 'استكشف الفئات',
      description: 'تصفح المحتوى حسب الفئات',
      href: '/categories',
      color: 'bg-blue-600'
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* الرقم 404 */}
          <div className="mb-12 relative">
            <div className="flex justify-center items-center">
              <div className="relative">
                <div className="text-[12rem] md:text-[16rem] font-bold select-none flex items-center">
                  <span className="text-islamic-primary/40 dark:text-islamic-primary/30 drop-shadow-lg">4</span>
                  <div className="relative mx-2 z-10">
                    <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-islamic-primary/20 to-blue-600/20 blur-xl"></div>
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-islamic-primary to-blue-600 flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-105">
                      <Search className="h-16 w-16 md:h-20 md:w-20 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <span className="text-islamic-primary/40 dark:text-islamic-primary/30 drop-shadow-lg">4</span>
                </div>
              </div>
            </div>
          </div>

          {/* العنوان والوصف */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-arabic text-islamic-primary mb-6 drop-shadow-sm">
              الصفحة غير موجودة
            </h1>
            <p className="text-xl text-muted-foreground dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر. 
              يمكنك استخدام الروابط أدناه للعثور على ما تبحث عنه.
            </p>
          </div>

          {/* الاقتراحات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {suggestions.map((suggestion, index) => {
              const IconComponent = suggestion.icon
              return (
                <Link key={index} href={suggestion.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border border-slate-200 dark:border-slate-800 dark:bg-slate-900/50">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-xl ${suggestion.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold font-arabic text-lg mb-2 group-hover:text-islamic-primary transition-colors">
                        {suggestion.title}
                      </h3>
                      <p className="text-sm text-muted-foreground dark:text-slate-400">
                        {suggestion.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* روابط إضافية */}
          <div className="space-y-4">
            <p className="text-muted-foreground dark:text-slate-400 font-arabic">أو يمكنك:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" variant="islamic" className="font-arabic shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto">
                  <Home className="mr-2 h-5 w-5" />
                  العودة للرئيسية
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button size="lg" variant="outline" className="font-arabic border-slate-300 dark:border-slate-700 w-full sm:w-auto">
                  إبلاغ عن مشكلة
                </Button>
              </Link>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="mt-16 p-6 bg-slate-100 dark:bg-slate-800/50 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground dark:text-slate-400 font-arabic">
              إذا وصلت لهذه الصفحة من خلال رابط في موقعنا، يرجى 
              <Link href="/contact" className="text-islamic-primary hover:underline mx-1 font-medium">
                إبلاغنا
              </Link>
              حتى نتمكن من إصلاح المشكلة.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
