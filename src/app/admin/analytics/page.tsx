// src/app/admin/analytics/page.tsx
import { Metadata } from 'next'
import AnalyticsClient from './AnalyticsClient'

export const metadata: Metadata = {
  title: 'التحليلات - لوحة التحكم',
  description: 'إحصائيات وتحليلات مدونة إعجاز',
}

export default function AnalyticsPage() {
  return <AnalyticsClient />
}
