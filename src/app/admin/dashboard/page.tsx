import { Metadata } from 'next'
import DashboardClient from './DashboardClient'

export const metadata: Metadata = {
  title: 'لوحة المعلومات - لوحة التحكم',
  description: 'لوحة المعلومات الرئيسية لمدونة إعجاز',
}

export default function DashboardPage() {
  return <DashboardClient />
} 