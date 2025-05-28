export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt?: string
          content: string
          featured_image?: string
          published_at: string
          updated_at: string
          status: string
          view_count: number
          likes_count: number
          reading_time?: number
          category_id: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string
          content: string
          featured_image?: string
          published_at?: string
          updated_at?: string
          status?: string
          view_count?: number
          likes_count?: number
          reading_time?: number
          category_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          featured_image?: string
          published_at?: string
          updated_at?: string
          status?: string
          view_count?: number
          likes_count?: number
          reading_time?: number
          category_id?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          color: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          color?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          color?: string
        }
      }
    }
    Functions: {
      increment_view_count: {
        Args: {
          post_id: string
        }
        Returns: number
      }
      toggle_like_count: {
        Args: {
          post_id: string
          increment: boolean
        }
        Returns: number
      }
    }
  }
} 