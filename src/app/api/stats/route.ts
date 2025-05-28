import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = cookies()
    
    // إنشاء عميل Supabase للسيرفر
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    // استعلام لجلب إجمالي عدد المقالات المنشورة
    const { count: totalPosts, error: postsError } = await supabase
      .from('posts')
      .select('id', { count: 'exact' })
      .eq('status', 'published')
    
    if (postsError) {
      console.error('Error fetching posts count:', postsError)
      return NextResponse.json({ error: 'Error fetching posts count' }, { status: 500 })
    }
    
    // استعلام لجلب مجموع المشاهدات من جميع المقالات
    const { data: viewsData, error: viewsError } = await supabase
      .from('posts')
      .select('view_count')
      .eq('status', 'published')
    
    let totalViews = 0
    
    if (!viewsError && viewsData) {
      // جمع عدد المشاهدات من جميع المقالات
      totalViews = viewsData.reduce((sum, post) => sum + (post.view_count || 0), 0)
    } else {
      console.error('Error fetching views count:', viewsError)
    }

    // استعلام لجلب عدد الفئات
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id', { count: 'exact' })
    
    if (categoriesError) {
      console.error('Error fetching categories count:', categoriesError)
    }
    
    return NextResponse.json({
      totalPosts: totalPosts || 0,
      totalViews: totalViews || 0,
      categoriesCount: categories?.length || 0
    })
  } catch (error) {
    console.error('Error in stats API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 