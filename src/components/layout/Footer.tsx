"use client"

// src/components/layout/Footer.tsx
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { 
  BookOpen, 
  Heart,
  ArrowUp,
  Send
} from 'lucide-react'
import { FaWhatsapp, FaTelegram, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { title: 'الرئيسية', href: '/' },
    { title: 'المقالات', href: '/posts' },
    { title: 'الفئات', href: '/categories' },
    { title: 'الأرشيف', href: '/archive' }
  ]

  const aboutLinks = [
    { title: 'حول المدونة', href: '/about' },
    { title: 'تواصل معنا', href: '/contact' },
    { title: 'سياسة الخصوصية', href: '/privacy' },
    { title: 'شروط الاستخدام', href: '/terms' }
  ]

  const categories = [
    { title: 'القرآن الكريم', href: '/categories/quran' },
    { title: 'الحديث الشريف', href: '/categories/hadith' },
    { title: 'الفقه الإسلامي', href: '/categories/fiqh' },
    { title: 'التاريخ الإسلامي', href: '/categories/history' }
  ]

  const socialLinks = [
    { icon: FaWhatsapp, href: '#', label: 'واتساب', color: 'hover:text-green-600' },
    { icon: FaTelegram, href: '#', label: 'تليجرام', color: 'hover:text-blue-500' },
    { icon: FaTwitter, href: '#', label: 'تويتر', color: 'hover:text-sky-500' },
    { icon: FaInstagram, href: '#', label: 'إنستجرام', color: 'hover:text-pink-500' },
    { icon: FaYoutube, href: '#', label: 'يوتيوب', color: 'hover:text-red-600' }
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-slate-900 text-white relative">
      {/* زر العودة لأعلى */}
      <button
        onClick={scrollToTop}
        className="absolute -top-6 right-6 w-12 h-12 bg-islamic-primary hover:bg-islamic-primary/90 rounded-full flex items-center justify-center transition-colors shadow-lg"
        aria-label="العودة لأعلى"
      >
        <ArrowUp className="h-5 w-5 text-white" />
      </button>

      <div className="container mx-auto px-4 py-12">
        {/* القسم الرئيسي */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* معلومات المدونة */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 space-x-reverse mb-4">
              <div className="w-10 h-10 bg-islamic-primary rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-arabic">إعجاز</span>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-6 font-arabic">
              مدونة إسلامية متخصصة في نشر المقالات والبحوث الشرعية التي تُثري المعرفة الإسلامية
              وتُقرب القارئ من فهم ديننا الحنيف.
            </p>

            {/* وسائل التواصل الاجتماعي */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={index}
                    href={social.href}
                    className={`text-gray-400 transition-colors ${social.color}`}
                    aria-label={social.label}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="font-bold font-arabic text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-islamic-gold transition-colors font-arabic"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* الفئات الرئيسية */}
          <div>
            <h3 className="font-bold font-arabic text-lg mb-4">الفئات الرئيسية</h3>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link 
                    href={category.href}
                    className="text-gray-300 hover:text-islamic-gold transition-colors font-arabic"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* النشرة البريدية */}
          <div>
            <h3 className="font-bold font-arabic text-lg mb-4">النشرة البريدية</h3>
            <p className="text-gray-300 mb-4 font-arabic text-sm">
              اشترك في نشرتنا البريدية لتصلك أحدث المقالات
            </p>
            
            <div className="flex space-x-2 space-x-reverse">
              <Input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button variant="islamic" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* القسم السفلي */}
        <div className="pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* حقوق الطبع */}
            <div className="text-gray-400 text-sm font-arabic">
              <p>
                © {currentYear} إعجاز. جميع الحقوق محفوظة.
              </p>
            </div>

            {/* روابط قانونية */}
            <div className="flex items-center space-x-6 space-x-reverse">
              {aboutLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-islamic-gold transition-colors text-sm font-arabic"
                >
                  {link.title}
                </Link>
              ))}
            </div>

            {/* رسالة */}
            <div className="flex items-center text-gray-400 text-sm font-arabic">
              <span>صُنع بـ</span>
              <Heart className="h-4 w-4 text-red-500 mx-1" />
              <span>في جمهورية مصر العربية</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
