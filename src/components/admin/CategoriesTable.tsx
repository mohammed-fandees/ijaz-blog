'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/components/ui/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Category = {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  created_at: string
  posts_count: number
}

export function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCategories = async () => {
    try {
      const { data: categoriesData, error } = await supabase
        .from('categories')
        .select(`
          *,
          posts:posts(count)
        `)
        .order('name')

      if (error) throw error

      const formattedCategories = categoriesData.map(category => ({
        ...category,
        posts_count: category.posts?.[0]?.count || 0
      }))

      setCategories(formattedCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        title: "خطأ في جلب التصنيفات",
        description: "حدث خطأ أثناء محاولة جلب التصنيفات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error

      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
      toast({
        title: "تم حذف التصنيف",
        description: "تم حذف التصنيف بنجاح",
      })
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        title: "خطأ في حذف التصنيف",
        description: "حدث خطأ أثناء محاولة حذف التصنيف. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setDeletingCategoryId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>اسم التصنيف</TableHead>
            <TableHead>الرابط</TableHead>
            <TableHead>عدد المقالات</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
              </TableCell>
              <TableCell dir="ltr">{category.slug}</TableCell>
              <TableCell>
                <Badge variant="secondary">{category.posts_count}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Icons.edit className="h-4 w-4" />
                    <span className="sr-only">تعديل</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setDeletingCategoryId(category.id)}
                  >
                    <Icons.trash className="h-4 w-4" />
                    <span className="sr-only">حذف</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog 
        open={!!deletingCategoryId} 
        onOpenChange={() => setDeletingCategoryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا التصنيف؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيؤدي هذا الإجراء إلى حذف التصنيف بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingCategoryId && handleDelete(deletingCategoryId)}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 