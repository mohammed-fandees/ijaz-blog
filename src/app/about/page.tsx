// src/app/about/page.tsx
import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Heart, 
  Users, 
  Star,
  Target,
  Lightbulb,
  Globe,
  Award
} from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'حول المدونة | إعجاز',
  description: 'تعرف على مدونة إعجاز ورسالتها في نشر المعرفة الإسلامية',
}

export default function AboutPage() {
  const features = [
    {
      icon: BookOpen,
      title: 'محتوى أصيل',
      description: 'مقالات مكتوبة بعناية فائقة ومراجعة شرعية دقيقة'
    },
    {
      icon: Heart,
      title: 'سهولة القراءة',
      description: 'تصميم مريح للعينين مع خيارات تخصيص متقدمة'
    },
    {
      icon: Users,
      title: 'مجتمع متفاعل',
      description: 'منصة تفاعلية تجمع المهتمين بالثقافة الإسلامية'
    },
    {
      icon: Globe,
      title: 'وصول عالمي',
      description: 'محتوى متاح للجميع في أي وقت ومن أي مكان'
    }
  ]

  const values = [
    {
      icon: Target,
      title: 'الدقة والأمانة',
      description: 'نلتزم بالدقة العلمية والأمانة في نقل المعلومات الشرعية'
    },
    {
      icon: Lightbulb,
      title: 'التبسيط والوضوح',
      description: 'نسعى لتبسيط المفاهيم الإسلامية دون الإخلال بجوهرها'
    },
    {
      icon: Star,
      title: 'التميز والجودة',
      description: 'نهدف لتقديم محتوى عالي الجودة يليق بالرسالة الإسلامية'
    }
  ]

  const stats = [
    { number: '500+', label: 'مقال منشور' },
    { number: '50K+', label: 'قارئ شهرياً' },
    { number: '15', label: 'فئة متنوعة' },
    { number: '3', label: 'سنوات من العطاء' }
  ]

  return (
    <div className="min-h-screen">
      {/* القسم الترحيبي */}
      <section className="py-20 bg-gradient-to-br from-islamic-primary/10 to-islamic-gold/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-islamic-primary flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold font-arabic text-islamic-primary mb-6">
            مرحباً بكم في إعجاز
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            مدونة إسلامية تهدف إلى نشر المعرفة الشرعية بأسلوب عصري ومبسط، 
            لتكون مرجعاً موثوقاً للباحثين عن الحقيقة والمعرفة الإسلامية الأصيلة
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/posts">
              <Button size="lg" variant="islamic" className="font-arabic">
                <BookOpen className="mr-2 h-5 w-5" />
                استكشف المقالات
              </Button>
            </Link>
            
            <Link href="/contact">
              <Button size="lg" variant="outline" className="font-arabic">
                تواصل معنا
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* الإحصائيات */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-islamic-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-arabic">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* رسالتنا */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-arabic text-islamic-primary mb-4">
                رسالتنا
              </h2>
              <div className="w-20 h-1 bg-islamic-gold mx-auto"></div>
            </div>
            
            <Card className="p-8">
              <CardContent className="text-center">
                <p className="text-lg leading-relaxed font-arabic text-muted-foreground mb-6">
                  نسعى في مدونة "إعجاز" إلى بناء جسر معرفي يربط بين التراث الإسلامي العريق 
                  والعصر الحديث، من خلال تقديم محتوى إسلامي أصيل ومتنوع يخاطب العقل والقلب معاً.
                </p>
                
                <p className="text-lg leading-relaxed font-arabic text-muted-foreground">
                  نؤمن بأن المعرفة الإسلامية الصحيحة هي نور يضيء الطريق للإنسان في جميع جوانب حياته،
                  ولذلك نحرص على تقديم مقالات مدروسة ومراجعة من قبل أهل الاختصاص.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* مميزاتنا */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-arabic text-islamic-primary mb-4">
              ما يميزنا
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              نقدم تجربة قراءة فريدة تجمع بين الأصالة والحداثة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-islamic-primary/10 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-islamic-primary" />
                    </div>
                    <h3 className="font-bold font-arabic text-lg mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* قيمنا */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-arabic text-islamic-primary mb-4">
              قيمنا الأساسية
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              المبادئ التي نسير عليها في رحلتنا لنشر المعرفة
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-12 h-12 rounded-lg bg-islamic-gold/20 flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-islamic-gold" />
                      </div>
                      <CardTitle className="font-arabic text-xl">
                        {value.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* الفريق */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-arabic text-islamic-primary mb-4">
              فريق العمل
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              نخبة من المتخصصين في العلوم الشرعية والتقنية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* يمكن إضافة معلومات الفريق هنا */}
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 rounded-full bg-islamic-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-10 w-10 text-islamic-primary" />
                </div>
                <h3 className="font-bold font-arabic text-lg mb-2">
                  فريق المراجعة الشرعية
                </h3>
                <p className="text-muted-foreground text-sm">
                  علماء وطلاب علم متخصصون في مراجعة وتدقيق المحتوى
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 rounded-full bg-islamic-gold/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-10 w-10 text-islamic-gold" />
                </div>
                <h3 className="font-bold font-arabic text-lg mb-2">
                  فريق التحرير
                </h3>
                <p className="text-muted-foreground text-sm">
                  كتاب ومحررون متخصصون في صياغة المحتوى الإسلامي
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="font-bold font-arabic text-lg mb-2">
                  فريق التقنية
                </h3>
                <p className="text-muted-foreground text-sm">
                  مطورون ومصممون يعملون على تحسين تجربة المستخدم
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-16 bg-islamic-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-arabic mb-4">
            انضم إلى رحلتنا
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            كن جزءاً من مجتمعنا المتنامي واستفد من المحتوى الإسلامي الأصيل
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/posts">
              <Button size="lg" variant="secondary" className="font-arabic">
                ابدأ القراءة الآن
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="font-arabic text-white border-white hover:bg-white hover:text-islamic-primary"
              >
                تواصل معنا
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
