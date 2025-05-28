'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CounterAnimation } from '@/components/ui/counter-animation';
import { motion } from 'framer-motion';

interface AnimatedStatsSectionProps {
  totalPosts: number;
  totalViews: number;
  categoriesCount: number;
}

// العام الذي تم فيه افتتاح المدونة
const FOUNDING_YEAR = 2025;

export function AnimatedStatsSection({
  totalPosts,
  totalViews,
  categoriesCount
}: AnimatedStatsSectionProps) {
  // ابدأ بعرض سنة واحدة على الأقل كقيمة افتراضية
  const [yearsOfOperation, setYearsOfOperation] = useState(1);
  
  // استخدام useEffect للتأكد من أن حساب العام يتم فقط على جانب العميل
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = currentYear - FOUNDING_YEAR;
    // التأكد من أن العدد لا يقل عن 1
    setYearsOfOperation(years <= 0 ? 1 : years);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-islamic-primary">
              <CounterAnimation 
                end={totalPosts} 
                delay={100} 
                formatAsArabic={false}
                useLocaleString={true}
              />
            </div>
            <div className="text-sm text-muted-foreground">مقال منشور</div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-islamic-gold">
              <CounterAnimation 
                end={totalViews} 
                delay={300} 
                formatAsArabic={false}
                useLocaleString={true}
              />
            </div>
            <div className="text-sm text-muted-foreground">مشاهدة</div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              <CounterAnimation 
                end={categoriesCount} 
                delay={500} 
                formatAsArabic={false}
                useLocaleString={true}
              />
            </div>
            <div className="text-sm text-muted-foreground">فئة متنوعة</div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600 flex justify-center">
              <CounterAnimation 
                end={yearsOfOperation} 
                delay={700} 
                formatAsArabic={false}
                useLocaleString={true}
              />
            </div>
            <div className="text-sm text-muted-foreground">سنوات من العطاء</div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
} 