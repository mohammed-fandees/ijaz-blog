import { Metadata } from 'next'
import CategoriesClient from './CategoriesClient'

export const metadata: Metadata = {
  title: 'إدارة التصنيفات - لوحة التحكم',
  description: 'إدارة وتنظيم تصنيفات المقالات في مدونة إعجاز',
}

export default function AdminCategoriesPage() {
  return <CategoriesClient />
} 