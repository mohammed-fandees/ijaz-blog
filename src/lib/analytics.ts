/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/analytics.ts
import { supabase } from '@/app/lib/supabase'
import { getDeviceInfo, generateVisitorId, generateSessionId } from './utils'

interface AnalyticsEvent {
  event_type: 'page_view' | 'article_read' | 'article_like' | 'search' | 'download'
  post_id?: string
  visitor_id: string
  session_id: string
  ip_address?: string
  user_agent?: string
  referrer?: string
  device_info?: any
  reading_progress?: number
  time_spent?: number
}

class AnalyticsService {
  private visitorId: string = ''
  private sessionId: string = ''
  private startTime: number = 0
  private isInitialized: boolean = false

  init() {
    if (typeof window === 'undefined' || this.isInitialized) return
    
    this.visitorId = generateVisitorId()
    this.sessionId = generateSessionId()
    this.startTime = Date.now()
    this.isInitialized = true

    // تتبع مغادرة الصفحة
    window.addEventListener('beforeunload', () => {
      this.trackTimeSpent()
    })

    // تتبع الرؤية
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.trackTimeSpent()
      }
    })
  }

  async trackEvent(event: Partial<AnalyticsEvent>) {
    if (typeof window === 'undefined' || !this.isInitialized) return

    try {
      const deviceInfo = getDeviceInfo()
      
      const eventData = {
        event_type: event.event_type || 'page_view',
        post_id: event.post_id || null,
        visitor_id: this.visitorId,
        session_id: this.sessionId,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        device_info: deviceInfo,
        reading_progress: event.reading_progress || null,
        time_spent: event.time_spent || null,
        created_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('analytics_events')
        .insert([eventData])

      if (error) {
        console.error('Analytics tracking error:', error)
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error)
    }
  }

  async trackPageView(postId?: string) {
    await this.trackEvent({
      event_type: 'page_view',
      post_id: postId
    })
  }

  async trackArticleRead(postId: string, readingProgress: number) {
    await this.trackEvent({
      event_type: 'article_read',
      post_id: postId,
      reading_progress: readingProgress
    })
  }

  async trackSearch(searchQuery: string) {
    await this.trackEvent({
      event_type: 'search',
      // يمكن حفظ استعلام البحث في metadata
      // إذا أردت حفظ الاستعلام، يمكنك إضافته إلى device_info أو إضافة حقل جديد
      device_info: { ...(getDeviceInfo()), search_query: searchQuery }
    })
  }

  async trackLike(postId: string) {
    await this.trackEvent({
      event_type: 'article_like',
      post_id: postId
    })
  }

  private trackTimeSpent() {
    if (this.startTime > 0) {
      const timeSpent = Math.round((Date.now() - this.startTime) / 1000)
      
      // حفظ وقت القراءة لهذه الجلسة
      if (timeSpent > 5) { // تتبع فقط إذا قضى أكثر من 5 ثوان
        this.trackEvent({
          event_type: 'page_view',
          time_spent: timeSpent
        })
      }
    }
  }

  private async getClientIP(): Promise<string | null> {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.log(error)
      return null
    }
  }

  // تتبع تقدم القراءة
  trackReadingProgress(postId: string) {
    if (typeof window === 'undefined') return

    let lastProgress = 0
    
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.round((scrollTop / docHeight) * 100)

      // تتبع كل 25% من التقدم
      if (progress >= lastProgress + 25 && progress <= 100) {
        lastProgress = Math.floor(progress / 25) * 25
        this.trackArticleRead(postId, lastProgress)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }
}

export const analytics = new AnalyticsService()
