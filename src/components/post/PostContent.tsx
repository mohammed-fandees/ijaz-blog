// src/components/post/PostContent.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSettingsStore } from '@/store/useSettingsStore'
import { ReadingSettingsPanel } from '@/components/post/ReadingSettingsPanel'
import { useTheme } from 'next-themes'

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  const { 
    fontSize, 
    fontFamily, 
    lineHeight, 
    textWidth, 
    backgroundColor,
    isDarkMode
  } = useSettingsStore()
  
  const { setTheme } = useTheme()
  const isInitialMount = useRef(true)

  // فقط تعيين السمة عند تغيير isDarkMode، مع تجنب التحديث الأول
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setTheme(isDarkMode ? 'dark' : 'light');
      return;
    }
    
    // تعيين السمة عند تغيير isDarkMode (عندما ينقر المستخدم على زر التبديل)
    setTheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, setTheme]);

  const fontSizeMap = {
    small: '1rem',
    medium: '1.125rem',
    large: '1.25rem',
    xlarge: '1.375rem'
  }

  const fontFamilyMap = {
    amiri: 'Amiri',
    noto: 'Noto Sans Arabic',
    cairo: 'Cairo'
  }

  const lineHeightMap = {
    compact: '1.5',
    normal: '1.8',
    relaxed: '2.1'
  }

  const textWidthMap = {
    narrow: '55ch',
    normal: '70ch',
    wide: '85ch'
  }

  // ألوان الخلفية للوضع الفاتح
  const lightBackgroundColorMap = {
    white: '#ffffff',
    beige: '#f5f5dc',
    gray: '#f8f9fa',
    sepia: '#fdf6e3'
  }

  // ألوان الخلفية للوضع الداكن
  const darkBackgroundColorMap = {
    white: '#1a1a1a',
    beige: '#2a2826',
    gray: '#202124',
    sepia: '#2c2b25'
  }

  const backgroundColorMap = isDarkMode ? darkBackgroundColorMap : lightBackgroundColorMap

  const contentStyle = {
    '--reading-font-size': fontSizeMap[fontSize],
    '--reading-font-family': fontFamilyMap[fontFamily],
    '--reading-line-height': lineHeightMap[lineHeight],
    '--reading-width': textWidthMap[textWidth],
    '--reading-bg': backgroundColorMap[backgroundColor],
  } as React.CSSProperties

  return (
    <div className="relative">
      {/* لوحة إعدادات القراءة */}
      <ReadingSettingsPanel />
      
      {/* المحتوى */}
      <div 
        className="reading-mode prose prose-lg max-w-none font-arabic lg:mx-auto"
        style={contentStyle}
      >
        <div 
          className={`p-6 md:p-8 rounded-lg transition-colors duration-300 ${isDarkMode ? 'prose-invert' : 'prose'}`}
          style={{ 
            backgroundColor: backgroundColorMap[backgroundColor],
            maxWidth: textWidthMap[textWidth],
            margin: '0 auto',
            boxShadow: isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold font-arabic mb-6 text-islamic-primary dark:text-islamic-gold">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold font-arabic mb-4 mt-8 text-islamic-primary dark:text-islamic-gold">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold font-arabic mb-3 mt-6 text-islamic-primary dark:text-islamic-gold">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-6 leading-relaxed text-justify" style={{ fontSize: fontSizeMap[fontSize], lineHeight: lineHeightMap[lineHeight] }}>
                  {children}
                </p>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-r-4 border-islamic-gold bg-islamic-gold/5 dark:bg-islamic-gold/10 p-4 my-6 rounded-r-lg">
                  <div className="font-arabic text-islamic-primary dark:text-islamic-gold">
                    {children}
                  </div>
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-6 space-y-3">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-6 space-y-3">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="mb-2 leading-relaxed" style={{ fontSize: fontSizeMap[fontSize] }}>
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-islamic-primary dark:text-islamic-gold">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-islamic-gold">
                  {children}
                </em>
              ),
              code: ({ children }) => (
                <code className="bg-muted dark:bg-muted/30 px-2 py-1 rounded text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-muted dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-6">
                  {children}
                </pre>
              ),
              img: ({ src, alt }) => (
                <div className="my-8">
                  <img 
                    src={src || ''} 
                    alt={alt || ''} 
                    className="rounded-lg w-full object-cover shadow-md hover:shadow-lg transition-shadow duration-300" 
                  />
                  {alt && <p className="text-center text-sm text-muted-foreground mt-2">{alt}</p>}
                </div>
              ),
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  className="text-islamic-primary dark:text-islamic-gold underline hover:no-underline transition-all"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              hr: () => (
                <hr className="my-8 border-t-2 border-muted dark:border-muted/30" />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
