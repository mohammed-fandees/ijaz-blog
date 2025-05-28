"use client"
import { Card } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { DashboardChart } from '@/components/admin/DashboardChart'
import { RecentPosts } from '@/components/admin/RecentPosts'
import { useAuth } from '@/lib/auth'

export default function DashboardClient() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">لوحة المعلومات</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Icons.post className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المقالات</p>
              <h3 className="text-2xl font-bold">24</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-full">
              <Icons.view className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">المشاهدات اليوم</p>
              <h3 className="text-2xl font-bold">1,234</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Icons.user className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الزوار اليوم</p>
              <h3 className="text-2xl font-bold">456</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <Icons.comment className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">التعليقات الجديدة</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <div className="p-6">
            <h3 className="text-lg font-medium">إحصائيات الزيارات</h3>
            <DashboardChart />
          </div>
        </Card>

        <Card className="col-span-3">
          <div className="p-6">
            <h3 className="text-lg font-medium">آخر المقالات</h3>
            <RecentPosts />
          </div>
        </Card>
      </div>
    </div>
  )
} 