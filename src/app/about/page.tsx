// src/app/about/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Heart, 
  Users, 
  Star,
  Target,
  Lightbulb,
  Globe,
  Award,
  Mail
} from 'lucide-react'
import { AnimatedStatsSection } from '@/components/stats/AnimatedStatsSection'
import AnimatedElement, { AnimatedContainer, AnimatedItem } from '@/components/ui/animated-element'

export default function AboutPage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    categoriesCount: 0
  });
  
  useEffect(() => {
    // جلب الإحصائيات عند تحميل الصفحة
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalPosts: data.totalPosts || 0,
            totalViews: data.totalViews || 0,
            categoriesCount: data.categoriesCount || 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }
    
    fetchStats();
  }, []);

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

  return (
    <div className="min-h-screen">
      {/* القسم الترحيبي */}
      <AnimatedElement 
        className="relative py-20 bg-gradient-to-br from-islamic-primary/5 to-islamic-gold/5 islamic-pattern"
        animation="fadeIn"
        delay={0.1}
      >
        <div className="container mx-auto px-4 text-center">
          <AnimatedElement 
            animation="fadeInUp" 
            delay={0.2}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-arabic text-islamic-primary mb-6">
              مرحباً بكم في إعجاز
            </h1>
          </AnimatedElement>
          
          <AnimatedElement 
            animation="fadeInUp" 
            delay={0.3}
          >
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              مدونة إسلامية تهدف إلى نشر المعرفة الشرعية بأسلوب عصري ومبسط، 
              لتكون مرجعاً موثوقاً للباحثين عن الحقيقة والمعرفة الإسلامية الأصيلة
            </p>
          </AnimatedElement>
          
          <AnimatedElement 
            animation="fadeInUp" 
            delay={0.4}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/posts">
                <Button size="lg" variant="islamic" className="font-arabic">
                  <BookOpen className="ml-2 h-5 w-5" />
                  استكشف المقالات
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button size="lg" variant="outline" className="font-arabic">
                  <Mail className="ml-2 h-5 w-5" />
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </AnimatedElement>

          {/* إحصائيات سريعة مع أنيميشن */}
          <AnimatedStatsSection 
            totalPosts={stats.totalPosts} 
            totalViews={stats.totalViews} 
            categoriesCount={stats.categoriesCount} 
          />
        </div>
      </AnimatedElement>

      {/* رسالتنا */}
      <AnimatedElement 
        className="py-16 bg-muted/30"
        animation="fadeIn"
        delay={0.1}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedElement 
              className="text-center mb-12"
              animation="fadeInUp"
              delay={0.2}
            >
              <h2 className="text-3xl font-bold font-arabic text-islamic-primary mb-4">
                رسالتنا
              </h2>
              <div className="w-20 h-1 bg-islamic-gold mx-auto"></div>
            </AnimatedElement>
            
            <AnimatedElement 
              animation="fadeInUp"
              delay={0.3}
            >
              <Card className="p-8">
                <CardContent className="text-center">
                  <p className="text-lg leading-relaxed font-arabic text-muted-foreground mb-6">
                    نسعى في مدونة &quot;إعجاز&quot; إلى بناء جسر معرفي يربط بين التراث الإسلامي العريق 
                    والعصر الحديث، من خلال تقديم محتوى إسلامي أصيل ومتنوع يخاطب العقل والقلب معاً.
                  </p>
                  
                  <p className="text-lg leading-relaxed font-arabic text-muted-foreground">
                    نؤمن بأن المعرفة الإسلامية الصحيحة هي نور يضيء الطريق للإنسان في جميع جوانب حياته،
                    ولذلك نحرص على تقديم مقالات مدروسة ومراجعة من قبل أهل الاختصاص.
                  </p>
                </CardContent>
              </Card>
            </AnimatedElement>
          </div>
        </div>
      </AnimatedElement>

      {/* مميزاتنا */}
      <AnimatedElement 
        className="py-16"
        animation="fadeIn"
        delay={0.1}
      >
        <div className="container mx-auto px-4">
          <AnimatedElement 
            className="text-center mb-12"
            animation="fadeInUp"
            delay={0.2}
          >
            <h2 className="text-3xl font-bold font-arabic text-islamic-primary mb-4">
              ما يميزنا
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              نقدم تجربة قراءة فريدة تجمع بين الأصالة والحداثة
            </p>
          </AnimatedElement>

          <AnimatedContainer 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            staggerChildren={0.1}
            delay={0.3}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <AnimatedItem key={index}>
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
                </AnimatedItem>
              )
            })}
          </AnimatedContainer>
        </div>
      </AnimatedElement>

      {/* قيمنا */}
      <AnimatedElement 
        className="py-16 bg-muted/30"
        animation="fadeIn"
        delay={0.1}
      >
        <div className="container mx-auto px-4">
          <AnimatedElement 
            className="text-center mb-12"
            animation="fadeInUp"
            delay={0.2}
          >
            <h2 className="text-3xl font-bold font-arabic text-islamic-primary mb-4">
              قيمنا الأساسية
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              المبادئ التي نسير عليها في رحلتنا لنشر المعرفة
            </p>
          </AnimatedElement>

          <AnimatedContainer 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            staggerChildren={0.1}
            delay={0.3}
          >
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <AnimatedItem key={index}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
                </AnimatedItem>
              )
            })}
          </AnimatedContainer>
        </div>
      </AnimatedElement>

      {/* الفريق */}
      <AnimatedElement 
        className="py-16"
        animation="fadeIn"
        delay={0.1}
      >
        <div className="container mx-auto px-4">
          <AnimatedElement 
            className="text-center mb-12"
            animation="fadeInUp"
            delay={0.2}
          >
            <h2 className="text-3xl font-bold font-arabic text-islamic-primary mb-4">
              فريق العمل
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              نخبة من المتخصصين في العلوم الشرعية والتقنية
            </p>
          </AnimatedElement>

          <AnimatedContainer 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto"
            staggerChildren={0.1}
            delay={0.3}
          >
            {/* يمكن إضافة معلومات الفريق هنا */}
            <AnimatedItem>
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
            </AnimatedItem>

            <AnimatedItem>
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
            </AnimatedItem>

            <AnimatedItem>
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
            </AnimatedItem>
          </AnimatedContainer>
        </div>
      </AnimatedElement>

      {/* دعوة للعمل */}
      <AnimatedElement 
        className="py-16 bg-muted/30"
        animation="fadeIn"
        delay={0.1}
      >
        <div className="container mx-auto px-4 text-center">
          <AnimatedElement 
            animation="fadeInUp"
            delay={0.2}
          >
            <h2 className="text-3xl font-bold font-arabic mb-4 text-islamic-primary">
              انضم إلى رحلتنا
            </h2>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
              كن جزءاً من مجتمعنا المتنامي واستفد من المحتوى الإسلامي الأصيل
            </p>
          </AnimatedElement>
          
          <AnimatedElement 
            animation="fadeInUp"
            delay={0.3}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/posts">
                <Button size="lg" variant="islamic" className="font-arabic">
                  <BookOpen className="ml-2 h-5 w-5" />
                  ابدأ القراءة الآن
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="font-arabic hover:bg-islamic-primary/5"
                >
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </AnimatedElement>
        </div>
      </AnimatedElement>
    </div>
  )
}
