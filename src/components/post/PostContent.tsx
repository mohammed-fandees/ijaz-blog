// src/components/post/PostContent.tsx
'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSettingsStore } from '@/store/useSettingsStore'
import { ReadingSettingsPanel } from '@/components/post/ReadingSettingsPanel'

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  const { 
    fontSize, 
    fontFamily, 
    lineHeight, 
    textWidth, 
    backgroundColor 
  } = useSettingsStore()

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
    normal: '65ch',
    wide: '75ch'
  }

  const backgroundColorMap = {
    white: '#ffffff',
    beige: '#f5f5dc',
    gray: '#f8f9fa',
    sepia: '#fdf6e3'
  }

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
        className="reading-mode prose prose-lg max-w-none font-arabic"
        style={contentStyle}
      >
        <div 
          className="p-8 rounded-lg transition-colors duration-300"
          style={{ backgroundColor: backgroundColorMap[backgroundColor] }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold font-arabic mb-6 text-islamic-primary">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold font-arabic mb-4 mt-8 text-islamic-primary">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold font-arabic mb-3 mt-6 text-islamic-primary">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-6 leading-relaxed text-justify">
                  {children}
                </p>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-r-4 border-islamic-gold bg-islamic-gold/5 p-4 my-6 rounded-r-lg">
                  <div className="font-arabic text-islamic-primary">
                    {children}
                  </div>
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-6 space-y-2">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-6 space-y-2">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="mb-1 leading-relaxed">
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-islamic-primary">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-islamic-gold">
                  {children}
                </em>
              ),
              code: ({ children }) => (
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
                  {children}
                </pre>
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
