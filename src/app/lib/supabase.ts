// src/lib/supabase.ts
'use client '
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// للعميل (Client-side)
export const createClientSideSupabase = () => createClientComponentClient()


// العميل العام
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// أنواع البيانات 
export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          featured_image: string | null
          category_id: string | null
          tags: string[] | null
          status: 'draft' | 'published' | 'archived'
          meta_title: string | null
          meta_description: string | null
          reading_time: number | null
          view_count: number
          likes_count: number
          author_id: string
          created_at: string
          updated_at: string
          published_at: string | null
          scheduled_for: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          featured_image?: string | null
          category_id?: string | null
          tags?: string[] | null
          status?: 'draft' | 'published' | 'archived'
          meta_title?: string | null
          meta_description?: string | null
          reading_time?: number | null
          view_count?: number
          likes_count?: number
          author_id: string
          created_at?: string
          updated_at?: string
          published_at?: string | null
          scheduled_for?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          featured_image?: string | null
          category_id?: string | null
          tags?: string[] | null
          status?: 'draft' | 'published' | 'archived'
          meta_title?: string | null
          meta_description?: string | null
          reading_time?: number | null
          view_count?: number
          likes_count?: number
          author_id?: string
          created_at?: string
          updated_at?: string
          published_at?: string | null
          scheduled_for?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          slug: string
          color: string
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          slug: string
          color: string
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          slug?: string
          color?: string
          icon?: string | null
          created_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          post_id: string | null
          event_type: 'page_view' | 'article_read' | 'article_like' | 'search' | 'download'
          visitor_id: string
          session_id: string
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          device_info: any | null
          location_data: any | null
          reading_progress: number | null
          time_spent: number | null
          created_at: string
        }
        Insert: {
          id?: string
          post_id?: string | null
          event_type: 'page_view' | 'article_read' | 'article_like' | 'search' | 'download'
          visitor_id: string
          session_id: string
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          device_info?: any | null
          location_data?: any | null
          reading_progress?: number | null
          time_spent?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string | null
          event_type?: 'page_view' | 'article_read' | 'article_like' | 'search' | 'download'
          visitor_id?: string
          session_id?: string
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          device_info?: any | null
          location_data?: any | null
          reading_progress?: number | null
          time_spent?: number | null
          created_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          site_name: string
          site_description: string
          site_logo: string | null
          primary_color: string
          secondary_color: string
          social_links: any | null
          seo_settings: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_name: string
          site_description: string
          site_logo?: string | null
          primary_color: string
          secondary_color: string
          social_links?: any | null
          seo_settings?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          site_name?: string
          site_description?: string
          site_logo?: string | null
          primary_color?: string
          secondary_color?: string
          social_links?: any | null
          seo_settings?: any | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
