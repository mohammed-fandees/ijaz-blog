// src/components/ui/loading.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
}

export function Loading({ className, size = 'md', text, variant = 'spinner' }: LoadingProps) {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  if (variant === 'spinner') {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
        <Loader2 className={cn('animate-spin text-islamic-primary', sizeMap[size])} />
        {text && (
          <p className="text-sm text-muted-foreground font-arabic">{text}</p>
        )}
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center space-x-2 space-x-reverse', className)}>
        <div className="flex space-x-1 space-x-reverse">
          <div className="w-2 h-2 bg-islamic-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-islamic-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-islamic-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        {text && (
          <p className="text-sm text-muted-foreground font-arabic mr-3">{text}</p>
        )}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className={cn('bg-islamic-primary rounded-full animate-pulse', sizeMap[size])}></div>
        {text && (
          <p className="text-sm text-muted-foreground font-arabic mr-3">{text}</p>
        )}
      </div>
    )
  }

  return null
}

export function LoadingCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-48 w-full rounded-t-lg"></div>
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 rounded"></div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded"></div>
        ))}
      </div>
    </div>
  )
}

export function LoadingButton() {
  return (
    <div className="flex items-center space-x-2 space-x-reverse">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>جاري التحميل...</span>
    </div>
  )
}
