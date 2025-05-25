// src/components/post/TableOfContents.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { List, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    // استخراج العناوين من المحتوى
    const headings = extractHeadings(content)
    setTocItems(headings)

    // إضافة معرفات للعناوين في DOM
    addHeadingIds()

    // مراقبة العناوين النشطة
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-50px 0px -50px 0px' }
    )

    // مراقبة جميع العناوين
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
      if (heading.id) {
        observer.observe(heading)
      }
    })

    return () => observer.disconnect()
  }, [content])

  const extractHeadings = (content: string): TocItem[] => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const headings: TocItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = generateId(text)
      
      headings.push({ id, text, level })
    }

    return headings
  }

  const generateId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const addHeadingIds = () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    headings.forEach((heading, index) => {
      if (!heading.id) {
        const text = heading.textContent || ''
        heading.id = generateId(text) || `heading-${index}`
      }
    })
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  if (tocItems.length === 0) return null

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-arabic flex items-center">
            <List className="h-5 w-5 mr-2" />
            فهرس المحتويات
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="pt-0">
          <nav className="space-y-1">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={cn(
                  'block w-full text-right text-sm py-2 px-3 rounded transition-colors font-arabic',
                  'hover:bg-accent hover:text-accent-foreground',
                  activeId === item.id && 'bg-islamic-primary/10 text-islamic-primary font-medium border-r-2 border-islamic-primary',
                  item.level === 1 && 'font-semibold',
                  item.level === 2 && 'pr-4',
                  item.level === 3 && 'pr-6 text-xs',
                  item.level >= 4 && 'pr-8 text-xs text-muted-foreground'
                )}
              >
                {item.text}
              </button>
            ))}
          </nav>
        </CardContent>
      )}
    </Card>
  )
}
