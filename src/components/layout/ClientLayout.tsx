'use client'

import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/layout/Header'
import { usePathname } from 'next/navigation'
import { Footer } from '@/components/layout/Footer'

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {!isAdminPage && <Header />}
        <QueryProvider>
          {children}
        </QueryProvider>
        {!isAdminPage && <Footer />}
      </ThemeProvider>
      <Toaster />
    </AuthProvider>
  )
}