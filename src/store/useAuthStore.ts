// src/store/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/app/lib/supabase'

interface User {
  id: string
  email: string
  role: 'admin' | 'user'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithCode: (code: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          // تنفيذ عملية تسجيل الدخول مع Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) throw error

          if (data.user) {
            const user = {
              id: data.user.id,
              email: data.user.email!,
              role: 'admin' as const
            }
            set({ user, isAuthenticated: true, isLoading: false })
            return true
          }
          return false
        } catch (error) {
          console.error('Login error:', error)
          set({ isLoading: false })
          return false
        }
      },

      loginWithCode: async (code: string) => {
        set({ isLoading: true })
        try {
          // التحقق من كود الدخول الخاص
          if (code === process.env.NEXT_PUBLIC_ADMIN_ACCESS_CODE) {
            const user = {
              id: 'admin',
              email: 'admin@ejaz.com',
              role: 'admin' as const
            }
            set({ user, isAuthenticated: true, isLoading: false })
            return true
          }
          set({ isLoading: false })
          return false
        } catch (error) {
          console.error('Code login error:', error)
          set({ isLoading: false })
          return false
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
        supabase.auth.signOut()
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
