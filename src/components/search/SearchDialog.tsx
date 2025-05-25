// src/components/search/SearchDialog.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  BookOpen, 
  Clock, 
  Tag,
  ArrowLeft 
} from 'lucide-react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { formatRelativeTime, truncateText } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  excerpt: string
  slug: string
  published_at: string
  category: {
    name: string
    color: string
  }
  tags: string[]
  reading_time: number
}

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    // تحميل البحثات الأخيرة من localStorage
    const saved = localStorage.getItem('recent_searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const searchPosts = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          excerpt,
          slug,
          published_at,
          reading_time,
          tags,
          categories!inner(name, color)
        `)
        .eq('status', 'published')
        .textSearch('search_vector', searchQuery)
        .limit(10)

      if (error) throw error

      const formattedResults = data.map(post => ({
        ...post,
        category: post.categories
      }))

      setResults(formattedResults)
      
      // حفظ البحث في التاريخ
      saveSearchToHistory(searchQuery)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSearchToHistory = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(q => q !== searchQuery)]
      .slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recent_searches', JSON.stringify(updated))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recent_searches')
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPosts(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-right font-arabic">البحث في المقالات</DialogTitle>
        </DialogHeader>
        
        <div className="px-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن مقال..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10 text-right"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 pt-4">
          {!query && recentSearches.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  البحثات الأخيرة
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-xs"
                >
                  مسح الكل
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => setQuery(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">جاري البحث...</p>
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد نتائج لهذا البحث</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                نتائج البحث ({results.length})
              </h3>
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/posts/${result.slug}`}
                  onClick={onClose}
                  className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium line-clamp-2 font-arabic">
                        {result.title}
                      </h4>
                      <ArrowLeft className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0 mr-2" />
                    </div>
                    
                    {result.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {truncateText(result.excerpt, 120)}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <Badge 
                          variant="secondary" 
                          style={{ backgroundColor: `${result.category.color}20`, color: result.category.color }}
                        >
                          {result.category.name}
                        </Badge>
                        
                        <span className="flex items-center space-x-1 space-x-reverse">
                          <Clock className="h-3 w-3" />
                          <span>{result.reading_time} دقيقة</span>
                        </span>
                      </div>
                      
                      <span>{formatRelativeTime(result.published_at)}</span>
                    </div>

                    {result.tags && result.tags.length > 0 && (
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {result.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
