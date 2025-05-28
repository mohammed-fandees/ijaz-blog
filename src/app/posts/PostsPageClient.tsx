'use client'

import React, { useEffect, useState, useCallback, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import PostResults from '@/components/post/PostResults'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen,
  Filter,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react'
import { Pagination } from '@/components/ui/pagination'
import { SearchForm } from '@/components/post/SearchForm'
import AnimatedElement from '@/components/ui/animated-element'
import { getSupabase } from '@/lib/supabase-client'

import type { Post } from '@/types/post'

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
}

interface TagCount {
  tag: string;
  count: number;
}

const POSTS_PER_PAGE = 9

export default function PostsPageClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1
  const categorySlug = searchParams.get('category') || undefined
  const tag = searchParams.get('tag') || undefined
  const searchQuery = searchParams.get('q') && searchParams.get('q')!.trim() !== '' 
    ? searchParams.get('q') as string 
    : undefined

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularTags, setPopularTags] = useState<TagCount[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const totalPages = Math.ceil(count / POSTS_PER_PAGE);
  
  // الفئة النشطة
  const activeCategory = categorySlug && categories.length > 0
    ? categories.find(cat => cat.slug === categorySlug)
    : null;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const supabase = getSupabase()
        
        // فتش المقالات
        const from = (currentPage - 1) * POSTS_PER_PAGE;
        const to = from + POSTS_PER_PAGE - 1;
        
        let query = supabase
          .from('posts')
          .select(`
            id,
            title,
            excerpt,
            slug,
            featured_image,
            published_at,
            reading_time,
            view_count,
            likes_count,
            tags,
            categories(name, color, slug)
          `, { count: 'exact' })
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .range(from, to);
        
        if (categorySlug) {
          query = query.eq('categories.slug', categorySlug);
        }
        
        if (tag) {
          query = query.contains('tags', [tag]);
        }
        
        if (searchQuery && searchQuery.trim() !== '') {
          query = query.ilike('title', `%${searchQuery}%`);
        }
        
        const { data: postsData, count: totalCount, error: postsError } = await query;
        
        if (postsError) {
          console.error('Error fetching posts:', postsError);
        } else {
          const processedPosts = postsData.map(post => ({
            ...post,
            category: post.categories ? post.categories[0] : undefined
          }));
          setPosts(processedPosts as unknown as Post[]);
          setCount(totalCount || 0);
        }
        
        // فتش الفئات
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
        } else {
          setCategories(categoriesData as Category[]);
        }
        
        // فتش العلامات الشائعة
        const { data: tagsData, error: tagsError } = await supabase
          .from('posts')
          .select('tags')
          .eq('status', 'published');
        
        if (tagsError) {
          console.error('Error fetching tags:', tagsError);
        } else {
          // استخراج العلامات وحساب تكرارها
          const tagCounts: Record<string, number> = {};
          tagsData.forEach(post => {
            if (post.tags && Array.isArray(post.tags)) {
              post.tags.forEach((tag: string) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
              });
            }
          });
          
          // تحويل إلى مصفوفة وترتيب حسب العدد
          const sortedTags = Object.entries(tagCounts)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
          
          setPopularTags(sortedTags);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [currentPage, categorySlug, tag, searchQuery])

  // تابع مساعد لتحديث الرابط بسلاسة
  const updateUrl = useCallback((params: { [key: string]: string | undefined }) => {
    startTransition(() => {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      
      // تحديث أو حذف المعايير
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, value)
        } else {
          newSearchParams.delete(key)
        }
      })
      
      // استخدام replace لتجنب إضافة إلى سجل التصفح
      router.replace(`${pathname}?${newSearchParams.toString()}`)
    })
  }, [pathname, router, searchParams])

  const handleSearch = useCallback((query: string) => {
    updateUrl({ q: query, page: undefined })
  }, [updateUrl])

  // تحديث معالجي الأحداث للفئات والعلامات
  const handleCategoryClick = useCallback((slug: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    updateUrl({ category: slug, tag: undefined, q: undefined, page: undefined })
  }, [updateUrl])

  const handleTagClick = useCallback((tagName: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    updateUrl({ tag: tagName, category: undefined, q: undefined, page: undefined })
  }, [updateUrl])

  const handleResetClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.replace('/posts')
  }

  const isLoadingAny = isLoading || isPending

  return (
    <div className="min-h-screen">
      <section className="relative py-16 bg-gradient-to-br from-islamic-primary/10 to-islamic-gold/10 islamic-pattern">
        <div className="container mx-auto px-4 text-center">
          <AnimatedElement animation="fadeInUp" delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-bold font-arabic text-islamic-primary mb-6">
              مكتبة المقالات
            </h1>
          </AnimatedElement>
          
          <AnimatedElement animation="fadeInUp" delay={0.2}>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              مجموعة متنوعة من المقالات الإسلامية المختارة بعناية لإثراء معرفتك وتوسيع آفاقك
            </p>
          </AnimatedElement>
          
          <AnimatedElement animation="fadeInUp" delay={0.25}>
            <nav className="flex justify-center items-center text-sm text-muted-foreground mb-8">
              <Link href="/" className="hover:text-foreground transition-colors">
                الرئيسية
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-foreground">المقالات</span>
              
              {activeCategory && (
                <>
                  <ChevronRight className="h-4 w-4 mx-2" />
                  <span className="text-foreground" style={{ color: activeCategory.color }}>
                    {activeCategory.name}
                  </span>
                </>
              )}
              
              {tag && (
                <>
                  <ChevronRight className="h-4 w-4 mx-2" />
                  <span className="text-foreground text-islamic-gold">#{tag}</span>
                </>
              )}
              
              {searchQuery && (
                <>
                  <ChevronRight className="h-4 w-4 mx-2" />
                  <span className="text-foreground">نتائج البحث: {searchQuery}</span>
                </>
              )}
            </nav>
          </AnimatedElement>
          
          <AnimatedElement animation="fadeInUp" delay={0.3}>
            <div className="max-w-lg mx-auto">
              <SearchForm 
                defaultValue={searchQuery} 
                onSearch={handleSearch}
              />
            </div>
          </AnimatedElement>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <AnimatedElement 
              className="lg:w-1/4"
              animation="fadeInRight"
              delay={0.2}
              threshold={0.1}
            >
              <div className="sticky top-20 space-y-8">
                <div className="bg-card rounded-lg border border-islamic-primary/10 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold font-arabic flex items-center text-lg text-islamic-primary">
                      <Filter className="ml-2 h-5 w-5" />
                      تصفية المقالات
                    </h3>
                    
                    {(categorySlug || tag || searchQuery) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-islamic-primary/20 hover:bg-islamic-primary/5"
                        onClick={handleResetClick}
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        إعادة تعيين
                      </Button>
                    )}
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="font-semibold mb-4 font-arabic text-islamic-gold flex items-center">
                      <span className="w-5 h-5 rounded-full bg-islamic-gold/20 inline-flex items-center justify-center text-islamic-gold ml-2 text-xs">
                        {categories.length}
                      </span>
                      الفئات
                    </h4>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <a 
                          key={category.id}
                          href={`/posts?category=${category.slug}`}
                          onClick={handleCategoryClick(category.slug)}
                          className="block"
                        >
                          <Badge 
                            variant={categorySlug === category.slug ? 'default' : 'outline'} 
                            className="w-full justify-start py-1.5 hover:opacity-80 transition-opacity mb-1.5 group"
                            style={categorySlug === category.slug ? 
                              { backgroundColor: category.color } : 
                              { borderColor: `${category.color}40` }
                            }
                          >
                            <span 
                              className="w-2 h-2 rounded-full ml-2 transition-all duration-300 group-hover:w-3"
                              style={{ backgroundColor: categorySlug === category.slug ? 
                                'white' : category.color 
                              }}
                            />
                            {category.name}
                          </Badge>
                        </a>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4 font-arabic text-islamic-gold flex items-center">
                      <span className="w-5 h-5 rounded-full bg-islamic-gold/20 inline-flex items-center justify-center text-islamic-gold ml-2 text-xs">
                        {popularTags.length}
                      </span>
                      العلامات الشائعة
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map(({ tag: tagName, count }) => (
                        <a
                          key={tagName}
                          href={`/posts?tag=${tagName}`}
                          onClick={handleTagClick(tagName)}
                        >
                          <Badge 
                            variant={tag === tagName ? 'default' : 'outline'} 
                            className={`hover:bg-muted hover:text-foreground transition-colors ${
                              tag === tagName ? 
                                'bg-islamic-gold text-white hover:bg-islamic-gold/90' : 
                                'hover:bg-islamic-gold/10 hover:text-islamic-gold'
                            }`}
                          >
                            #{tagName} 
                            <span className="mr-1 opacity-70">({count})</span>
                          </Badge>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border border-islamic-primary/10 p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-islamic-pattern opacity-5 rotate-45"></div>
                  
                  <h3 className="font-bold font-arabic flex items-center text-lg mb-6 text-islamic-primary">
                    <SlidersHorizontal className="ml-2 h-5 w-5" />
                    إحصائيات
                  </h3>
                  
                  <div className="space-y-4 text-sm relative z-10">
                    <div className="flex justify-between items-center bg-muted/30 p-3 rounded-md">
                      <span className="text-muted-foreground">إجمالي المقالات:</span>
                      <span className="font-semibold text-islamic-primary">{count}</span>
                    </div>
                    
                    <div className="flex justify-between items-center bg-muted/30 p-3 rounded-md">
                      <span className="text-muted-foreground">عدد الفئات:</span>
                      <span className="font-semibold text-islamic-primary">{categories.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center bg-muted/30 p-3 rounded-md">
                      <span className="text-muted-foreground">عدد العلامات:</span>
                      <span className="font-semibold text-islamic-primary">{popularTags.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedElement>
            
            <div className="lg:w-3/4">
              <AnimatedElement animation="fadeInLeft" delay={0.2} threshold={0.1}>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-islamic-primary/10">
                  <h2 className="text-2xl font-bold font-arabic flex items-center text-islamic-primary">
                    <BookOpen className="ml-2 h-6 w-6" />
                    {activeCategory 
                      ? `مقالات ${activeCategory.name}`
                      : tag
                        ? `مقالات مصنفة بـ #${tag}`
                        : searchQuery
                          ? `نتائج البحث: ${searchQuery}`
                          : 'جميع المقالات'
                    }
                  </h2>
                  
                  <div className="text-sm flex items-center">
                    <span className="text-muted-foreground ml-2">عدد المقالات:</span>
                    <span className="text-islamic-primary font-semibold">{count}</span>
                  </div>
                </div>
              </AnimatedElement>
              
              {posts.length === 0 && !isLoadingAny && (
                <AnimatedElement animation="fadeIn" delay={0.3}>
                  <div className="bg-gradient-to-r from-islamic-primary/5 to-islamic-gold/5 rounded-lg p-10 text-center border border-islamic-primary/10 islamic-pattern">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-islamic-primary/10 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-islamic-primary" />
                    </div>
                    <h3 className="text-xl font-bold font-arabic mb-3 text-islamic-primary">
                      لا توجد مقالات
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      لم يتم العثور على مقالات تطابق معايير البحث الخاصة بك
                    </p>
                    <Link href="/posts">
                      <Button variant="islamic" className="group relative overflow-hidden">
                        <span className="relative z-10">عرض جميع المقالات</span>
                        <span className="absolute inset-0 bg-islamic-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </Button>
                    </Link>
                  </div>
                </AnimatedElement>
              )}
              
              <PostResults posts={posts} isLoading={isLoadingAny} />
              
              {totalPages > 1 && !isLoadingAny && (
                <AnimatedElement animation="fadeInUp" delay={0.3} threshold={0.1}>
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    baseUrl={`/posts${
                      categorySlug ? `?category=${categorySlug}` : 
                      tag ? `?tag=${tag}` : 
                      searchQuery ? `?q=${searchQuery}` : ''
                    }`}
                  />
                </AnimatedElement>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
