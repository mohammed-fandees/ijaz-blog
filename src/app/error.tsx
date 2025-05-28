// src/app/error.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  MessageCircle
} from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8">
            <CardContent>
              {/* أيقونة التحذير */}
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>

              {/* العنوان والوصف */}
              <h1 className="text-3xl font-bold font-arabic text-red-600 mb-4">
                حدث خطأ غير متوقع
              </h1>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                نعتذر، حدث خطأ تقني غير متوقع. فريقنا يعمل على حل هذه المشكلة. 
                يمكنك المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
              </p>

              {/* تفاصيل الخطأ (في بيئة التطوير فقط) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                  <h3 className="font-semibold mb-2">تفاصيل الخطأ:</h3>
                  <pre className="text-sm text-red-600 overflow-auto">
                    {error.message}
                  </pre>
                  {error.digest && (
                    <p className="text-xs text-gray-500 mt-2">
                      معرف الخطأ: {error.digest}
                    </p>
                  )}
                </div>
              )}

              {/* أزرار الإجراءات */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={reset}
                  variant="islamic" 
                  size="lg"
                  className="font-arabic"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  إعادة المحاولة
                </Button>
                
                <Link href="/">
                  <Button variant="outline" size="lg" className="font-arabic">
                    <Home className="mr-2 h-5 w-5" />
                    العودة للرئيسية
                  </Button>
                </Link>
              </div>

              {/* رابط الإبلاغ */}
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-3 font-arabic">
                  إذا استمرت المشكلة، يرجى إبلاغنا:
                </p>
                <Link href="/contact">
                  <Button variant="ghost" size="sm" className="font-arabic">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    إبلاغ عن المشكلة
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
