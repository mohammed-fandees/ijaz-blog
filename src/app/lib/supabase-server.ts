import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'


// للخادم (Server-side)
export const createServerSideSupabase = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}