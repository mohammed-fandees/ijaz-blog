'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/ui/icons'
import { useAuth } from '@/lib/auth'
import { AuthError } from '@supabase/supabase-js'

const formSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
})

type FormData = z.infer<typeof formSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { signIn } = useAuth()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      await signIn(data.email, data.password)
      // لا نحتاج للتوجيه هنا لأن AuthProvider سيقوم بذلك
    } catch (error) {
      console.error('Login error:', error)
      let errorMessage = 'حدث خطأ أثناء تسجيل الدخول، الرجاء المحاولة مرة أخرى'
      
      if (error instanceof AuthError) {
        switch (error.message) {
          case 'Invalid login credentials':
            errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            break
          case 'Email not confirmed':
            errorMessage = 'يرجى تأكيد البريد الإلكتروني أولاً'
            break
          case 'Too many requests':
            errorMessage = 'محاولات كثيرة جداً، يرجى الانتظار قليلاً'
            break
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast({
        variant: 'destructive',
        title: 'خطأ في تسجيل الدخول',
        description: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80">البريد الإلكتروني</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Icons.mail className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground/40" />
                    <Input
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      className="pl-3 pr-10 py-6 bg-background/50 border-border/50 focus:border-islamic-primary/50 focus:ring-islamic-primary/30 transition-all"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80">كلمة المرور</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Icons.lock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground/40" />
                    <Input
                      type="password"
                      placeholder="أدخل كلمة المرور"
                      className="pl-3 pr-10 py-6 bg-background/50 border-border/50 focus:border-islamic-primary/50 focus:ring-islamic-primary/30 transition-all"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-islamic-primary hover:bg-islamic-primary/90 py-6 text-lg transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Icons.spinner className="ml-2 h-5 w-5 animate-spin" />
              جاري تسجيل الدخول...
            </>
          ) : (
            'تسجيل الدخول'
          )}
        </Button>
      </form>
    </Form>
  )
} 