// src/app/contact/page.tsx
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Mail, 
  MessageCircle, 
  Send,
  CheckCircle,
  MapPin,
  Phone,
  Globe
} from 'lucide-react'
import { FaWhatsapp, FaTelegram, FaTwitter, FaInstagram } from 'react-icons/fa'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // محاكاة إرسال الرسالة
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // إخفاء رسالة النجاح بعد 5 ثوان
      setTimeout(() => setSuccess(false), 5000)
    }, 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const contactMethods = [
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: 'info@ejaz.com',
      description: 'راسلنا عبر البريد الإلكتروني'
    },
    {
      icon: MessageCircle,
      title: 'الدردشة المباشرة',
      value: 'متاح 24/7',
      description: 'تحدث معنا مباشرة'
    },
    {
      icon: Phone,
      title: 'الهاتف',
      value: '+966 50 123 4567',
      description: 'اتصل بنا هاتفياً'
    }
  ]

  const socialLinks = [
    { icon: FaWhatsapp, name: 'واتساب', color: 'text-green-600', url: '#' },
    { icon: FaTelegram, name: 'تليجرام', color: 'text-blue-500', url: '#' },
    { icon: FaTwitter, name: 'تويتر', color: 'text-sky-500', url: '#' },
    { icon: FaInstagram, name: 'إنستجرام', color: 'text-pink-500', url: '#' }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* رأس الصفحة */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-arabic text-islamic-primary mb-4">
            تواصل معنا
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            نحن هنا للإجابة على استفساراتكم ومساعدتكم في كل ما يتعلق بالمحتوى الإسلامي
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* طرق التواصل */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">طرق التواصل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon
                  return (
                    <div key={index} className="flex items-start space-x-4 space-x-reverse">
                      <div className="w-12 h-12 rounded-lg bg-islamic-primary/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-islamic-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold font-arabic text-lg mb-1">
                          {method.title}
                        </h3>
                        <p className="text-islamic-primary font-medium mb-1">
                          {method.value}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* وسائل التواصل الاجتماعي */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">تابعنا على</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon
                    return (
                      <a
                        key={index}
                        href={social.url}
                        className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <IconComponent className={`h-5 w-5 ${social.color}`} />
                        <span className="font-arabic text-sm">{social.name}</span>
                      </a>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* ساعات العمل */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">ساعات الاستجابة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-arabic">الأحد - الخميس</span>
                    <span>9:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-arabic">الجمعة - السبت</span>
                    <span>عبر البريد الإلكتروني</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* نموذج الاتصال */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">أرسل لنا رسالة</CardTitle>
              </CardHeader>
              <CardContent>
                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3 space-x-reverse">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-green-800 font-arabic">
                      تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="font-arabic">الاسم الكامل</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="أدخل اسمك الكامل"
                        required
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="font-arabic">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="أدخل بريدك الإلكتروني"
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="font-arabic">موضوع الرسالة</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="ما هو موضوع رسالتك؟"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="font-arabic">الرسالة</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="اكتب رسالتك هنا..."
                      required
                      rows={6}
                      className="mt-2"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    size="lg"
                    variant="islamic"
                    className="w-full font-arabic"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="ml-2 h-4 w-4" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold font-arabic text-islamic-primary mb-4">
                نرحب بتواصلكم
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                سواء كان لديكم استفسار حول محتوى معين، أو اقتراح لموضوع جديد، 
                أو حتى ملاحظة على الموقع، فنحن نقدر تواصلكم ونسعى للرد على جميع الرسائل في أسرع وقت ممكن.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-islamic-primary/10 flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-6 w-6 text-islamic-primary" />
                  </div>
                  <h3 className="font-semibold font-arabic mb-2">استفسارات عامة</h3>
                  <p className="text-sm text-muted-foreground">أسئلة حول المحتوى والموقع</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-islamic-gold/10 flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-6 w-6 text-islamic-gold" />
                  </div>
                  <h3 className="font-semibold font-arabic mb-2">اقتراحات المحتوى</h3>
                  <p className="text-sm text-muted-foreground">أفكار لمواضيع جديدة</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold font-arabic mb-2">الدعم التقني</h3>
                  <p className="text-sm text-muted-foreground">مساعدة في استخدام الموقع</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
