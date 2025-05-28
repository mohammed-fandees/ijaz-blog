import { Metadata } from 'next'

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