'use client'
import { ReactNode, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { AuthContext, signIn, signOut } from '@/lib/auth'
import { supabase } from '@/app/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminStatus, setAdminStatus] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      const newUser = session?.user ?? null
      setUser(newUser)
      setAdminStatus(!!newUser)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null
      setUser(newUser)
      setAdminStatus(!!newUser)
      
      console.log('AuthProvider onAuthStateChange:', { event: _event, hasNewUser: !!newUser, pathname })

      if (newUser && pathname === '/admin/login') {
        console.log('AuthProvider: User logged in on login page, redirecting to dashboard')
        router.push('/admin/dashboard')
      } else if (!newUser && pathname?.startsWith('/admin') && pathname !== '/admin/login') {
        console.log('AuthProvider: User logged out or no session, on admin page, redirecting to login')
        router.push('/admin/login')
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [pathname, router])

  const value = {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      setLoading(true)
      try {
        await signIn(email, password)
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحباً بك في لوحة التحكم'
        })
      } catch (error) {
        let errorMessage = 'حدث خطأ أثناء تسجيل الدخول'
        if (error instanceof Error) {
          errorMessage = error.message
        }
        toast({
          variant: 'destructive',
          title: 'خطأ في تسجيل الدخول',
          description: errorMessage
        })
        throw error
      } finally {
        setLoading(false)
      }
    },
    signOut: async () => {
      setLoading(true)
      try {
        await signOut()
        if (!pathname?.startsWith('/admin')) {
            router.push('/')
        }
      } catch (error) {
        console.error("Sign out error in AuthProvider:", error)
        toast({
          variant: 'destructive',
          title: 'خطأ في تسجيل الخروج',
          description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
        })
      } finally {
        setLoading(false)
      }
    },
    isAdmin: adminStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 