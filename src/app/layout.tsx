import './globals.css'
import { Metadata } from 'next'
import { Inter, IBM_Plex_Sans_Arabic } from 'next/font/google'
import { cn } from '@/lib/utils'
import { ClientLayout } from '@/components/layout/ClientLayout'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['arabic'],
  variable: '--font-ibm-plex-sans-arabic',
})

export const metadata: Metadata = {
  title: {
    default: 'إعجاز | مدونة إسلامية للمقالات والبحوث الشرعية',
    template: '%s | إعجاز'
  },
  description: 'مدونة إسلامية متخصصة في نشر المقالات والبحوث الشرعية التي تُثري المعرفة الإسلامية',
  keywords: ['إسلام', 'قرآن', 'حديث', 'فقه', 'مقالات إسلامية', 'بحوث شرعية'],
  authors: [{ name: 'إعجاز' }],
  creator: 'إعجاز',
  publisher: 'إعجاز',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://ejaz.com',
    siteName: 'إعجاز',
    title: 'إعجاز | مدونة إسلامية',
    description: 'مدونة إسلامية متخصصة في نشر المقالات والبحوث الشرعية',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'إعجاز - مدونة إسلامية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'إعجاز | مدونة إسلامية',
    description: 'مدونة إسلامية متخصصة في نشر المقالات والبحوث الشرعية',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning={true}>
      <head />
      <body className={cn(
        inter.className,
        ibmPlexSansArabic.variable,
        'min-h-screen bg-background antialiased font-arabic'
      )}
      suppressHydrationWarning={true}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              <ClientLayout>
                {children}
              </ClientLayout>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}