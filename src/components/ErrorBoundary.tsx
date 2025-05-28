// src/components/ErrorBoundary.tsx
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo) 
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} reset={this.reset} />
      }

      return <DefaultErrorFallback error={this.state.error!} reset={this.reset} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          
          <h2 className="text-xl font-bold font-arabic text-red-600 mb-2">
            حدث خطأ غير متوقع
          </h2>
          
          <p className="text-muted-foreground mb-4 font-arabic">
            نعتذر، حدث خطأ أثناء تحميل هذا المحتوى
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-gray-100 rounded text-left text-sm">
              <code className="text-red-600">{error.message}</code>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} variant="islamic" className="font-arabic">
              <RefreshCw className="mr-2 h-4 w-4" />
              إعادة المحاولة
            </Button>
            
            <Link href="/">
              <Button variant="outline" className="font-arabic w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                العودة للرئيسية
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// HOC لتغليف المكونات
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
