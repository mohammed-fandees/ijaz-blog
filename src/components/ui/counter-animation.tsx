'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { formatArabicNumber, formatNumberWithCommas } from '@/lib/utils';

interface CounterAnimationProps {
  end: number;
  duration?: number;
  className?: string;
  delay?: number;
  formatAsArabic?: boolean;
  useLocaleString?: boolean;
}

export function CounterAnimation({ 
  end, 
  duration = 1500,
  className,
  delay = 0,
  formatAsArabic = false,
  useLocaleString = true
}: CounterAnimationProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // تأخير بدء الأنيميشن حسب المطلوب
    const delayTimer = setTimeout(() => {
      setHasStarted(true);
      
      // تقسيم الفترة الزمنية إلى أجزاء صغيرة
      const steps = 30;
      const stepTime = duration / steps;
      
      // بداية من صفر إلى الرقم النهائي
      countRef.current = 0;
      
      // وظيفة التحديث
      const updateCounter = () => {
        // تقريب القيمة الحالية للأعلى ببطء نحو القيمة النهائية
        countRef.current += end / steps;
        
        // إذا تجاوزنا الرقم النهائي
        if (countRef.current >= end) {
          countRef.current = end;
          setCount(end);
          
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        } else {
          setCount(Math.floor(countRef.current));
        }
      };
      
      // بدء التحديث على فترات
      timerRef.current = setInterval(updateCounter, stepTime);
    }, delay);
    
    // تنظيف عند إزالة المكون
    return () => {
      clearTimeout(delayTimer);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [end, duration, delay]);
  
  // تنسيق الرقم بناءً على الخيارات
  const formatNumber = (num: number) => {
    if (formatAsArabic) {
      return formatArabicNumber(num);
    } else if (useLocaleString) {
      return formatNumberWithCommas(num);
    } else {
      return num.toString();
    }
  };
  
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={hasStarted ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {formatNumber(count)}
    </motion.span>
  );
} 