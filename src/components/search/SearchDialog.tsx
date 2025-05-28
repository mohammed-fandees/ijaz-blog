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
  relevance_score?: number
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
      // 1. البحث باستخدام textSearch الخاص بـ Postgres (FTS - Full Text Search)
      const { data: ftsResults, error: ftsError } = await supabase
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
        .textSearch('search_vector', searchQuery, {
          config: 'arabic',
          type: 'websearch'
        })
        .limit(10)

      if (ftsError) throw ftsError

      // 2. البحث بالتشابه في العناوين (ILIKE search)
      const { data: titleResults, error: titleError } = await supabase
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
        .ilike('title', `%${searchQuery}%`)
        .limit(10)

      if (titleError) throw titleError

      // دمج النتائج وإزالة التكرارات
      const combinedResultsMap = new Map<string, SearchResult>();
      
      // إضافة نتائج البحث النصي الكامل أولًا (أولوية أعلى)
      ftsResults.forEach(post => {
        combinedResultsMap.set(post.id, {
          ...post,
          category: post.categories[0] || { name: '', color: '' },
          relevance_score: 2 // أولوية عالية للنتائج المطابقة في البحث النصي
        });
      });
      
      // إضافة نتائج البحث في العناوين
      titleResults.forEach(post => {
        // إذا كان المنشور موجودًا بالفعل، نضيف له نقاط أهمية إضافية
        if (combinedResultsMap.has(post.id)) {
          const existingPost = combinedResultsMap.get(post.id)!;
          existingPost.relevance_score = (existingPost.relevance_score || 0) + 1;
        } else {
          // إضافة منشور جديد
          combinedResultsMap.set(post.id, {
            ...post,
            category: post.categories[0] || { name: '', color: '' },
            relevance_score: 1 // أولوية أقل للنتائج المطابقة في العنوان فقط
          });
        }
      });
      
      // تحويل النتائج إلى مصفوفة وترتيبها حسب الأهمية
      const combinedResults = Array.from(combinedResultsMap.values())
        .sort((a, b) => {
          // ترتيب أولًا حسب الأهمية
          const scoreCompare = (b.relevance_score || 0) - (a.relevance_score || 0);
          if (scoreCompare !== 0) return scoreCompare;
          
          // في حالة تساوي الأهمية، نرتب حسب التاريخ (الأحدث أولًا)
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        });

      setResults(combinedResults);
      
      // حفظ البحث في التاريخ فقط إذا كانت هناك نتائج
      if (combinedResults.length > 0) {
        saveSearchToHistory(searchQuery.trim())
      }
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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden p-0 sm:mx-0 border-islamic-primary/20">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="mb-3 text-2xl font-bold tracking-tight text-right font-arabic text-islamic-primary">البحث في المقالات</DialogTitle>
        </DialogHeader>
        
        <div className="px-6">
          <div className="relative">            
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="ابحث عن مقال..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10 text-right bg-muted/50 focus-visible:ring-1 focus-visible:ring-islamic-primary/20 border-muted"
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
              <div className="flex flex-wrap gap-2">              {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent/80 transition-colors border-muted-foreground/20"
                    onClick={() => setQuery(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-primary mx-auto"></div>
              <p className="mt-2 text-sm font-arabic text-muted-foreground">جاري البحث...</p>
            </div>
          )}          {!isLoading && query && results.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground/70 mx-auto mb-4" />
              <p className="text-muted-foreground font-arabic">لا توجد نتائج لبحثك عن &quot;{query}&quot;</p>
              <p className="text-sm text-muted-foreground/60 mt-2">حاول البحث بكلمات مختلفة أو تحقق من الإملاء</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-4">
                <span className="bg-accent/50 text-foreground rounded-md px-2 py-0.5 text-xs">{results.length} نتيجة</span>
                <span>لبحثك عن &quot;{query}&quot;</span>
              </h3>
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/posts/${result.slug}`}
                  onClick={onClose}
                  className="block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
                >
                  <div className="space-y-2">                    <div className="flex items-start justify-between group">
                      <h4 className="font-semibold line-clamp-2 font-arabic text-foreground/90 group-hover:text-islamic-primary transition-colors">
                        {result.title}
                      </h4>
                      <ArrowLeft className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0 mr-2 group-hover:text-islamic-primary transition-colors" />
                    </div>
                    
                    {result.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {truncateText(result.excerpt, 120)}
                      </p>
                    )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <Badge 
                          variant="secondary" 
                          style={{ backgroundColor: `${result.category.color}15`, color: result.category.color }}
                          className="font-medium"
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
