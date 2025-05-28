// src/app/admin/posts/page.tsx
import { Metadata } from 'next'
import PostsClient from './PostsClient'

export const metadata: Metadata = {
  title: 'إدارة المقالات - لوحة التحكم',
  description: 'إدارة وتنظيم المقالات في مدونة إعجاز',
}

export default function AdminPostsPage() {
  return <PostsClient />
}
