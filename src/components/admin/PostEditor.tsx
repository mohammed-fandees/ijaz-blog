// src/components/admin/PostEditor.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2,
  Save,
  Eye,
  Upload,
  X,
  Calendar,
  Clock
} from 'lucide-react'
import { supabase } from '@/app/lib/supabase'
import { generateSlug, calculateReadingTime, generateExcerpt } from '@/lib/utils'
import { PostPreview } from '@/components/admin/PostPreview'

interface PostEditorProps {
  postId?: string
  initialData?: any
}

export function PostEditor({ postId, initialData }: PostEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category_id: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    meta_title: '',
    meta_description: '',
    scheduled_for: ''
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'ابدأ في كتابة مقالك هنا...',
      }),
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      setFormData(prev => ({
        ...prev,
        content,
        reading_time: calculateReadingTime(content)
      }))
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none font-arabic min-h-[400px] focus:outline-none p-4',
        dir: 'rtl'
      },
    },
  })

  useEffect(() => {
    fetchCategories()
    if (initialData) {
      setFormData({
        ...initialData,
        scheduled_for: initialData.scheduled_for ? 
          new Date(initialData.scheduled_for).toISOString().slice(0, 16) : ''
      })
      setTags(initialData.tags || [])
      editor?.commands.setContent(initialData.content || '')
    }
  }, [initialData, editor])

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    setCategories(data || [])
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      meta_title: title
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    if (!formData.title.trim()) {
      alert('يرجى إدخال عنوان المقال')
      return
    }

    setLoading(true)
    try {
      const postData = {
        ...formData,
        status,
        tags,
        excerpt: formData.excerpt || generateExcerpt(formData.content),
        reading_time: calculateReadingTime(formData.content),
        published_at: status === 'published' ? new Date().toISOString() : null,
        scheduled_for: formData.scheduled_for ? new Date(formData.scheduled_for).toISOString() : null,
        updated_at: new Date().toISOString()
      }

      if (postId) {
        // تحديث مقال موجود
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', postId)

        if (error) throw error
      } else {
        // إنشاء مقال جديد
        const { error } = await supabase
          .from('posts')
          .insert([{
            ...postData,
            author_id: 'admin', // يجب تعديل هذا ليستخدم المعرف الصحيح للمدير
            created_at: new Date().toISOString()
          }])

        if (error) throw error
      }

      router.push('/admin/posts')
    } catch (error) {
      console.error('Error saving post:', error)
      alert('حدث خطأ أثناء حفظ المقال')
    } finally {
      setLoading(false)
    }
  }

  const MenuBar = () => {
    if (!editor) return null

    return (
      <div className="border-b p-2 flex items-center space-x-2 space-x-reverse">
        <Button
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        
        <Button
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Button
          variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  if (isPreview) {
    return (
      <PostPreview
        post={{
          ...formData,
          tags,
          reading_time: calculateReadingTime(formData.content)
        }}
        onBack={() => setIsPreview(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* شريط الأدوات العلوي */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-arabic">
          {postId ? 'تحرير المقال' : 'إنشاء مقال جديد'}
        </h1>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button
            variant="outline"
            onClick={() => setIsPreview(true)}
            className="font-arabic"
          >
            <Eye className="mr-2 h-4 w-4" />
            معاينة
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={loading}
            className="font-arabic"
          >
            <Save className="mr-2 h-4 w-4" />
            حفظ كمسودة
          </Button>
          
          <Button
            variant="islamic"
            onClick={() => handleSave('published')}
            disabled={loading}
            className="font-arabic"
          >
            {loading ? 'جاري النشر...' : 'نشر المقال'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* المحتوى الرئيسي */}
        <div className="lg:col-span-2 space-y-6">
          {/* العنوان */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="title" className="font-arabic">عنوان المقال</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="أدخل عنوان مقالك هنا..."
                  className="text-lg font-arabic"
                />
              </div>
              
              <div>
                <Label htmlFor="slug" className="font-arabic">الرابط المختصر</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="article-slug"
                  className="font-english"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  /posts/{formData.slug}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* المحرر */}
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">محتوى المقال</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MenuBar />
              <EditorContent editor={editor} />
            </CardContent>
          </Card>

          {/* المقتطف */}
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">المقتطف</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="مقتطف قصير عن المقال (اختياري - سيتم إنشاؤه تلقائياً إذا تُرك فارغاً)"
                className="font-arabic"
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* الشريط الجانبي */}
        <div className="space-y-6">
          {/* إعدادات النشر */}
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">إعدادات النشر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status" className="font-arabic">حالة المقال</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="published">منشور</SelectItem>
                    <SelectItem value="archived">أرشيف</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="scheduled" className="font-arabic">جدولة النشر</Label>
                <Input
                  id="scheduled"
                  type="datetime-local"
                  value={formData.scheduled_for}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduled_for: e.target.value }))}
                  className="font-english"
                />
              </div>
            </CardContent>
          </Card>

          {/* الفئة */}
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">الفئة</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر فئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* العلامات */}
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">العلامات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2 space-x-reverse">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="أضف علامة جديدة"
                  className="font-arabic"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button onClick={addTag} size="sm">إضافة</Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="font-arabic">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 mr-1 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* الصورة المميزة */}
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">الصورة المميزة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  value={formData.featured_image}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                  placeholder="رابط الصورة"
                  className="font-english"
                />
                
                <Button variant="outline" className="w-full font-arabic">
                  <Upload className="mr-2 h-4 w-4" />
                  رفع صورة
                </Button>
                
                {formData.featured_image && (
                  <div className="relative">
                    <img
                      src={formData.featured_image}
                      alt="معاينة الصورة"
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* إعدادات SEO */}
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">تحسين محركات البحث</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title" className="font-arabic">عنوان SEO</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="عنوان محسن لمحركات البحث"
                  className="font-arabic"
                />
              </div>
              
              <div>
                <Label htmlFor="meta_description" className="font-arabic">وصف SEO</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="وصف محسن لمحركات البحث"
                  className="font-arabic"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
