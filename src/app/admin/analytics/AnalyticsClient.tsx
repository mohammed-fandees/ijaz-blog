/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'

import { supabase } from '@/app/lib/supabase'
import { formatDate } from '@/lib/utils'
import { Icons } from '@/components/ui/icons'
import { AnalyticsChart } from '@/components/admin/AnalyticsChart'
import { PopularPosts } from '@/components/admin/PopularPosts'
import { VisitorMap } from '@/components/admin/VisitorMap'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  totalPosts: number
  avgReadingTime: number
  dailyViews: any[]
  topPosts: any[]
  deviceStats: any[]
  trafficSources: any[]
}

export default function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/admin/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const endDate = new Date()
      const startDate = new Date()
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(endDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(endDate.getDate() - 90)
          break
      }

      // إجمالي المشاهدات
      const { data: totalViewsData } = await supabase
        .from('analytics_events')
        .select('id', { count: 'exact' })
        .eq('event_type', 'page_view')
        .gte('created_at', startDate.toISOString())

      // الزوار الفريدون
      const { data: uniqueVisitorsData } = await supabase
        .from('analytics_events')
        .select('visitor_id')
        .eq('event_type', 'page_view')
        .gte('created_at', startDate.toISOString())

      const uniqueVisitors = new Set(uniqueVisitorsData?.map(v => v.visitor_id)).size

      // إجمالي المقالات
      const { data: totalPostsData } = await supabase
        .from('posts')
        .select('id', { count: 'exact' })
        .eq('status', 'published')

      // المشاهدات اليومية
      const { data: dailyViewsData } = await supabase
        .from('analytics_events')
        .select('created_at')
        .eq('event_type', 'page_view')
        .gte('created_at', startDate.toISOString())
        .order('created_at')

      // معالجة البيانات اليومية
      const dailyViews = processDailyViews(dailyViewsData || [], startDate, endDate)

      // أفضل المقالات
      const { data: topPostsData } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          view_count,
          published_at,
          categories(name, color)
        `)
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .limit(10)

      // إحصائيات الأجهزة
      const { data: deviceData } = await supabase
        .from('analytics_events')
        .select('device_info')
        .eq('event_type', 'page_view')
        .gte('created_at', startDate.toISOString())
        .not('device_info', 'is', null)

      const deviceStats = processDeviceStats(deviceData || [])

      setData({
        totalViews: totalViewsData?.length || 0,
        uniqueVisitors,
        totalPosts: totalPostsData?.length || 0,
        avgReadingTime: 3.5, // يمكن حسابها من البيانات الفعلية
        dailyViews,
        topPosts: topPostsData?.map(post => ({
          ...post,
          category: post.categories
        })) || [],
        deviceStats,
        trafficSources: [] // يمكن إضافة هذا لاحقاً
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const processDailyViews = (data: any[], startDate: Date, endDate: Date) => {
    const views: { [key: string]: number } = {}
    
    data.forEach(item => {
      const date = new Date(item.created_at).toISOString().split('T')[0]
      views[date] = (views[date] || 0) + 1
    })

    const result = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      result.push({
        date: dateStr,
        views: views[dateStr] || 0,
        formattedDate: formatDate(dateStr)
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return result
  }

  const processDeviceStats = (data: any[]) => {
    const devices: { [key: string]: number } = {}
    
    data.forEach(item => {
      if (item.device_info?.deviceType) {
        const type = item.device_info.deviceType
        devices[type] = (devices[type] || 0) + 1
      }
    })

    return Object.entries(devices).map(([type, count]) => ({
      name: type === 'mobile' ? 'جوال' : type === 'tablet' ? 'لوحي' : 'حاسوب',
      value: count,
      color: type === 'mobile' ? '#8b5cf6' : type === 'tablet' ? '#06b6d4' : '#10b981'
    }))
  }

  const exportData = () => { // future improvement: add more export options
    // تصدير البيانات كـ CSV
    const csvData = data?.topPosts.map(post => ({
      'العنوان': post.title,
      'المشاهدات': post.view_count,
      'تاريخ النشر': formatDate(post.published_at),
      'الفئة': post.category?.name || 'غير محدد'
    }))

    // تحويل إلى CSV وتنزيل
    if (csvData) {
      const csv = convertToCSV(csvData)
      downloadCSV(csv, 'analytics-report.csv')
    }
  }

  const convertToCSV = (data: any[]) => {
    if (!data.length) return ''
    
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row => Object.values(row).join(','))
    return [headers, ...rows].join('\n')
  }

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-arabic">التحليلات والإحصائيات</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">التحليلات</h2>
        <p className="text-muted-foreground">
          إحصائيات وتحليلات تفصيلية عن أداء المدونة
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Icons.view className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المشاهدات</p>
              <h3 className="text-2xl font-bold">24,567</h3>
              <p className="text-sm text-green-600">+12.5% من الشهر الماضي</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Icons.user className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الزوار الفريدين</p>
              <h3 className="text-2xl font-bold">12,345</h3>
              <p className="text-sm text-green-600">+8.2% من الشهر الماضي</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <Icons.clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">متوسط وقت القراءة</p>
              <h3 className="text-2xl font-bold">4:32</h3>
              <p className="text-sm text-red-600">-2.1% من الشهر الماضي</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-full">
              <Icons.share className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">المشاركات</p>
              <h3 className="text-2xl font-bold">789</h3>
              <p className="text-sm text-green-600">+15.3% من الشهر الماضي</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <div className="p-6">
            <h3 className="text-lg font-medium">المشاهدات على مدار الشهر</h3>
            <AnalyticsChart />
          </div>
        </Card>

        <Card className="col-span-3">
          <div className="p-6">
            <h3 className="text-lg font-medium">المقالات الأكثر قراءة</h3>
            <PopularPosts />
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium">توزيع الزوار جغرافياً</h3>
          <VisitorMap />
        </div>
      </Card>
    </div>
  )
}