import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'حول المدونة | إعجاز',
  description: 'تعرف على مدونة إعجاز ورسالتها في نشر المعرفة الإسلامية',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 