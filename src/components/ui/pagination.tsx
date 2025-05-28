import React from 'react'
import Link from 'next/link'
import { 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  totalPages: number
  currentPage: number
  baseUrl: string
  maxDisplayedPages?: number
}

export function Pagination({ 
  totalPages, 
  currentPage, 
  baseUrl,
  maxDisplayedPages = 5
}: PaginationProps) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null
  }

  // Helper function to create a URL for a specific page
  const getPageUrl = (page: number) => {
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}page=${page}`
  }

  // Calculate range of pages to display
  let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2))
  const endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1)

  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxDisplayedPages) {
    startPage = Math.max(1, endPage - maxDisplayedPages + 1)
  }

  // Generate page numbers to display
  const pageNumbers: (number | 'ellipsis')[] = []

  // Always include first page
  if (startPage > 1) {
    pageNumbers.push(1)
    if (startPage > 2) {
      pageNumbers.push('ellipsis')
    }
  }

  // Add pages in range
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  // Always include last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageNumbers.push('ellipsis')
    }
    pageNumbers.push(totalPages)
  }

  return (
    <nav className="flex justify-center items-center my-8" aria-label="صفحات">
      {/* زر الصفحة السابقة */}
      <Button
        variant="outline"
        size="icon"
        className={`ml-2 border-islamic-primary/20 hover:bg-islamic-primary/5 transition-colors ${currentPage === 1 ? 'opacity-50' : ''}`}
        disabled={currentPage === 1}
        asChild={currentPage !== 1}
      >
        {currentPage === 1 ? (
          <span>
            <ChevronRight className="h-4 w-4" />
          </span>
        ) : (
          <Link href={getPageUrl(currentPage - 1)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </Button>

      {/* أرقام الصفحات */}
      <div className="flex space-x-1 space-x-reverse">
        {pageNumbers.map((page, index) => (
          page === 'ellipsis' ? (
            <span 
              key={`ellipsis-${index}`}
              className="w-9 h-9 flex items-center justify-center text-muted-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="icon"
              className={`w-9 h-9 transition-colors ${
                currentPage === page 
                  ? 'bg-islamic-primary hover:bg-islamic-primary/90' 
                  : 'border-islamic-primary/20 hover:bg-islamic-primary/5 hover:text-islamic-primary'
              }`}
              asChild={currentPage !== page}
            >
              {currentPage === page ? (
                <span>{page}</span>
              ) : (
                <Link href={getPageUrl(page)}>
                  {page}
                </Link>
              )}
            </Button>
          )
        ))}
      </div>

      {/* زر الصفحة التالية */}
      <Button
        variant="outline"
        size="icon"
        className={`mr-2 border-islamic-primary/20 hover:bg-islamic-primary/5 transition-colors ${currentPage === totalPages ? 'opacity-50' : ''}`}
        disabled={currentPage === totalPages}
        asChild={currentPage !== totalPages}
      >
        {currentPage === totalPages ? (
          <span>
            <ChevronLeft className="h-4 w-4" />
          </span>
        ) : (
          <Link href={getPageUrl(currentPage + 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}
      </Button>
    </nav>
  )
} 