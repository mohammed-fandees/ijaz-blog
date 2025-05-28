'use client'

import { LoginForm } from '@/components/admin/LoginForm'
import { Icons } from '@/components/ui/icons'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background to-background/95">
      {/* زخارف الخلفية */}
      <div className="absolute inset-0 bg-grid-islamic-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-auto w-[50rem] h-[40rem] bg-islamic-primary/30 rounded-full blur-3xl opacity-20" />
      </div>
      
      {/* نموذج تسجيل الدخول */}
      <Card className="relative w-full max-w-lg mx-4 p-8 shadow-2xl bg-card/60 backdrop-blur-xl border-2 border-border/50">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-islamic-primary text-white shadow-lg shadow-islamic-primary/30 transform hover:scale-105 transition-transform">
                <Icons.logo className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground font-arabic mt-8">
              تسجيل الدخول للوحة التحكم
            </h2>
            <p className="text-base text-muted-foreground">
              الرجاء إدخال بيانات الدخول للمتابعة
            </p>
          </div>

          <LoginForm />

          <div className="text-center text-sm text-muted-foreground">
            <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} إعجاز</p>
          </div>
        </div>
      </Card>
    </div>
  )
} 