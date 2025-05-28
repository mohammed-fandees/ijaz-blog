'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface SearchFormProps {
  defaultValue?: string
  categorySlug?: string
  tag?: string
}

export function SearchForm({ defaultValue = '', categorySlug, tag }: SearchFormProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(defaultValue)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Prevent empty searches or very short queries
    if (!searchQuery || searchQuery.trim().length < 2) {
      return
    }
    
    setIsSubmitting(true)
    
    // Construct the query URL
    let url = '/posts?q=' + encodeURIComponent(searchQuery.trim())
    
    if (categorySlug) {
      url += '&category=' + encodeURIComponent(categorySlug)
    }
    
    if (tag) {
      url += '&tag=' + encodeURIComponent(tag)
    }
    
    // Navigate to the search results
    router.push(url)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative group">
        <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${isFocused ? 'shadow-md shadow-islamic-primary/20' : 'shadow-sm'}`}></div>
        <Search className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${isFocused ? 'text-islamic-primary' : 'text-muted-foreground'}`} />
        <input
          type="text"
          placeholder="ابحث في المقالات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-16 pr-10 py-3 rounded-lg border bg-card border-islamic-primary/20 focus:outline-none focus:ring-2 focus:ring-islamic-primary/30 focus:border-islamic-primary/50 transition-all duration-300"
          minLength={2}
        />
        <Button 
          type="submit" 
          className="absolute left-1.5 top-1/2 transform -translate-y-1/2 bg-islamic-primary hover:bg-islamic-gold transition-colors duration-300 group-hover:shadow-sm" 
          size="sm"
          disabled={isSubmitting || !searchQuery || searchQuery.trim().length < 2}
          aria-label="بحث"
        >
          <Search className="h-4 w-4 mr-1" />
          بحث
        </Button>
      </div>
      
      {searchQuery && searchQuery.trim().length < 2 && (
        <p className="text-xs mt-1 text-red-500 font-semibold px-2">الرجاء إدخال كلمة بحث لا تقل عن حرفين</p>
      )}
    </form>
  )
} 