// src/app/admin/analytics/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  Eye, 
  Users, 
  Clock,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'
import { supabase } from '@/app/lib/supabase'
import { formatDate } from '@/lib/utils'

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

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

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

  const exportData = () => {
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

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-arabic">التحليلات والإحصائيات</h1>
          <p className="text-muted-foreground">
            تتبع أداء المدونة ومراقبة سلوك الزوار
          </p>
        </div>
        
        <div className="flex items-center space-x-4 space-x-reverse">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">آخر 7 أيام</SelectItem>
              <SelectItem value="30d">آخر 30 يوم</SelectItem>
              <SelectItem value="90d">آخر 3 أشهر</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={fetchAnalytics} className="font-arabic">
            <RefreshCw className="mr-2 h-4 w-4" />
            تحديث
          </Button>
          
          <Button variant="islamic" onClick={exportData} className="font-arabic">
            <Download className="mr-2 h-4 w-4" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-arabic">إجمالي المشاهدات</p>
                <p className="text-3xl font-bold">{data?.totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-arabic">الزوار الفريدون</p>
                <p className="text-3xl font-bold">{data?.uniqueVisitors.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-arabic">المقالات المنشورة</p>
                <p className="text-3xl font-bold">{data?.totalPosts}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-arabic">متوسط وقت القراءة</p>
                <p className="text-3xl font-bold">{data?.avgReadingTime} <span className="text-lg">دقيقة</span></p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* المشاهدات اليومية */}
        <Card>
          <CardHeader>
            <CardTitle className="font-arabic">المشاهدات اليومية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.dailyViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="formattedDate"
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => `التاريخ: ${label}`}
                  formatter={(value) => [`${value} مشاهدة`, 'المشاهدات']}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#1e3a8a" 
                  strokeWidth={2}
                  dot={{ fill: '#1e3a8a' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* إحصائيات الأجهزة */}
        <Card>
          <CardHeader>
            <CardTitle className="font-arabic">أنواع الأجهزة</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.deviceStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data?.deviceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} زيارة`, 'العدد']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* أفضل المقالات */}
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">المقالات الأكثر قراءة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.topPosts.slice(0, 10).map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-islamic-primary text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium font-arabic line-clamp-1">{post.title}</h3>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground">
                      <span>{formatDate(post.published_at)}</span>
                      {post.category && (
                        <>
                          <span>•</span>
                          <Badge 
                            variant="outline"
                            style={{ borderColor: post.category.color, color: post.category.color }}
                          >
                            {post.category.name}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{post.view_count.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
