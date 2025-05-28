// src/app/admin/settings/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings, 
  Globe, 
  Palette, 
  Link as LinkIcon,
  Save,
  Upload,
  Eye
} from 'lucide-react'
import { supabase } from '@/app/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

type SocialLinks = {
  twitter: string
  instagram: string
  youtube: string
  telegram: string
  whatsapp: string
}

type SeoSettings = {
  meta_title: string
  meta_description: string
  meta_keywords: string
  google_analytics: string
  google_search_console: string
}

type SettingsType = {
  site_name: string
  site_description: string
  site_logo: string
  primary_color: string
  secondary_color: string
  social_links: SocialLinks
  seo_settings: SeoSettings
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<SettingsType>({
    site_name: 'إعجاز',
    site_description: 'مدونة إسلامية للمقالات والبحوث الشرعية',
    site_logo: '',
    primary_color: '#1e3a8a',
    secondary_color: '#dc2626',
    social_links: {
      twitter: '',
      instagram: '',
      youtube: '',
      telegram: '',
      whatsapp: ''
    },
    seo_settings: {
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      google_analytics: '',
      google_search_console: ''
    }
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single()

      if (error) throw error

      if (data) {
        setSettings({
          site_name: data.site_name || 'إعجاز',
          site_description: data.site_description || '',
          site_logo: data.site_logo || '',
          primary_color: data.primary_color || '#1e3a8a',
          secondary_color: data.secondary_color || '#dc2626',
          social_links: data.social_links || {
            twitter: '',
            instagram: '',
            youtube: '',
            telegram: '',
            whatsapp: ''
          },
          seo_settings: data.seo_settings || {
            meta_title: '',
            meta_description: '',
            meta_keywords: '',
            google_analytics: '',
            google_search_console: ''
          }
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ إعدادات الموقع بنجاح",
        variant: "default"
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  type SectionKey = keyof SettingsType
  type SocialLinksKey = keyof SocialLinks
  type SeoSettingsKey = keyof SeoSettings

  const handleInputChange = (
    section: SectionKey,
    field: string,
    value: string
  ) => {
    setSettings(prev => {
      if (section === 'social_links') {
        return {
          ...prev,
          social_links: {
            ...prev.social_links,
            [field as SocialLinksKey]: value
          }
        }
      } else if (section === 'seo_settings') {
        return {
          ...prev,
          seo_settings: {
            ...prev.seo_settings,
            [field as SeoSettingsKey]: value
          }
        }
      } else {
        return {
          ...prev,
          [section]: value
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-arabic">إعدادات الموقع</h1>
          <p className="text-muted-foreground">
            تخصيص إعدادات المدونة والمظهر العام
          </p>
        </div>
        
        <Button 
          onClick={handleSave}
          disabled={loading}
          variant="islamic" 
          size="lg"
          className="font-arabic"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              حفظ التغييرات
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="font-arabic">
            <Settings className="mr-2 h-4 w-4" />
            عام
          </TabsTrigger>
          <TabsTrigger value="appearance" className="font-arabic">
            <Palette className="mr-2 h-4 w-4" />
            المظهر
          </TabsTrigger>
          <TabsTrigger value="social" className="font-arabic">
            <LinkIcon className="mr-2 h-4 w-4" />
            وسائل التواصل
          </TabsTrigger>
          <TabsTrigger value="seo" className="font-arabic">
            <Globe className="mr-2 h-4 w-4" />
            SEO
          </TabsTrigger>
        </TabsList>

        {/* الإعدادات العامة */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">معلومات الموقع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="site_name" className="font-arabic">اسم الموقع</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => handleInputChange('site_name', '', e.target.value)}
                    placeholder="اسم المدونة"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="site_logo" className="font-arabic">شعار الموقع</Label>
                  <div className="flex items-center space-x-2 space-x-reverse mt-2">
                    <Input
                      id="site_logo"
                      value={settings.site_logo}
                      onChange={(e) => handleInputChange('site_logo', '', e.target.value)}
                      placeholder="رابط الشعار"
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="site_description" className="font-arabic">وصف الموقع</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) => handleInputChange('site_description', '', e.target.value)}
                  placeholder="وصف مختصر عن المدونة"
                  rows={4}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات المظهر */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">ألوان الموقع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="primary_color" className="font-arabic">اللون الأساسي</Label>
                  <div className="flex items-center space-x-2 space-x-reverse mt-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => handleInputChange('primary_color', '', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.primary_color}
                      onChange={(e) => handleInputChange('primary_color', '', e.target.value)}
                      placeholder="#1e3a8a"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondary_color" className="font-arabic">اللون الثانوي</Label>
                  <div className="flex items-center space-x-2 space-x-reverse mt-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={settings.secondary_color}
                      onChange={(e) => handleInputChange('secondary_color', '', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.secondary_color}
                      onChange={(e) => handleInputChange('secondary_color', '', e.target.value)}
                      placeholder="#dc2626"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold font-arabic mb-3">معاينة الألوان:</h4>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: settings.primary_color }}
                  >
                    <Eye className="h-6 w-6" />
                  </div>
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: settings.secondary_color }}
                  >
                    <Eye className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* وسائل التواصل الاجتماعي */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">روابط وسائل التواصل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="twitter" className="font-arabic">تويتر</Label>
                  <Input
                    id="twitter"
                    value={settings.social_links.twitter}
                    onChange={(e) => handleInputChange('social_links', 'twitter', e.target.value)}
                    placeholder="https://twitter.com/username"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="instagram" className="font-arabic">إنستجرام</Label>
                  <Input
                    id="instagram"
                    value={settings.social_links.instagram}
                    onChange={(e) => handleInputChange('social_links', 'instagram', e.target.value)}
                    placeholder="https://instagram.com/username"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="youtube" className="font-arabic">يوتيوب</Label>
                  <Input
                    id="youtube"
                    value={settings.social_links.youtube}
                    onChange={(e) => handleInputChange('social_links', 'youtube', e.target.value)}
                    placeholder="https://youtube.com/channel"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="telegram" className="font-arabic">تليجرام</Label>
                  <Input
                    id="telegram"
                    value={settings.social_links.telegram}
                    onChange={(e) => handleInputChange('social_links', 'telegram', e.target.value)}
                    placeholder="https://t.me/username"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="whatsapp" className="font-arabic">واتساب</Label>
                  <Input
                    id="whatsapp"
                    value={settings.social_links.whatsapp}
                    onChange={(e) => handleInputChange('social_links', 'whatsapp', e.target.value)}
                    placeholder="+966501234567"
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات SEO */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">تحسين محركات البحث</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="meta_title" className="font-arabic">عنوان الصفحة الرئيسية</Label>
                <Input
                  id="meta_title"
                  value={settings.seo_settings.meta_title}
                  onChange={(e) => handleInputChange('seo_settings', 'meta_title', e.target.value)}
                  placeholder="عنوان محسن لمحركات البحث"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="meta_description" className="font-arabic">وصف الصفحة الرئيسية</Label>
                <Textarea
                  id="meta_description"
                  value={settings.seo_settings.meta_description}
                  onChange={(e) => handleInputChange('seo_settings', 'meta_description', e.target.value)}
                  placeholder="وصف محسن لمحركات البحث"
                  rows={3}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="meta_keywords" className="font-arabic">الكلمات المفتاحية</Label>
                <Input
                  id="meta_keywords"
                  value={settings.seo_settings.meta_keywords}
                  onChange={(e) => handleInputChange('seo_settings', 'meta_keywords', e.target.value)}
                  placeholder="كلمة1, كلمة2, كلمة3"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="google_analytics" className="font-arabic">Google Analytics ID</Label>
                <Input
                  id="google_analytics"
                  value={settings.seo_settings.google_analytics}
                  onChange={(e) => handleInputChange('seo_settings', 'google_analytics', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="google_search_console" className="font-arabic">Google Search Console</Label>
                <Input
                  id="google_search_console"
                  value={settings.seo_settings.google_search_console}
                  onChange={(e) => handleInputChange('seo_settings', 'google_search_console', e.target.value)}
                  placeholder="كود التحقق من Google Search Console"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
