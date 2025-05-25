// src/hooks/useAnalytics.ts
'use client'

import { useEffect } from 'react'
import { analytics } from '@/lib/analytics'

export function usePageTracking(postId?: string) {
  useEffect(() => {
    analytics.init()
    analytics.trackPageView(postId)
  }, [postId])
}

export function useReadingProgress(postId: string) {
  useEffect(() => {
    if (!postId) return
    
    analytics.init()
    const cleanup = analytics.trackReadingProgress(postId)
    
    return cleanup
  }, [postId])
}

export function useAnalytics() {
  return {
    trackSearch: analytics.trackSearch.bind(analytics),
    trackLike: analytics.trackLike.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics)
  }
}
