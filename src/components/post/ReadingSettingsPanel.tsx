/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/post/ReadingSettingsPanel.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Settings, 
  Type, 
  AlignJustify, 
  Maximize, 
  Palette,
  X,
  RotateCcw,
  Sun,
  Moon
} from 'lucide-react'
import { useSettingsStore } from '@/store/useSettingsStore'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'

export function ReadingSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    fontSize,
    fontFamily,
    lineHeight,
    textWidth,
    backgroundColor,
    isDarkMode,
    setFontSize,
    setFontFamily,
    setLineHeight,
    setTextWidth,
    setBackgroundColor,
    setDarkMode,
    resetToDefaults
  } = useSettingsStore()
  
  const { theme } = useTheme()
  const isThemeChanging = useRef(false)
  
  // تزامن سمة النظام مع إعدادات الوضع الداكن - منع التحديثات المتكررة
  useEffect(() => {
    // نتجاهل التغييرات المتكررة
    if (isThemeChanging.current) {
      return;
    }
    
    // فقط إذا كان هناك تغيير ضروري
    if (theme === 'dark' && !isDarkMode) {
      isThemeChanging.current = true;
      setDarkMode(true);
      setTimeout(() => {
        isThemeChanging.current = false;
      }, 100);
    } else if (theme === 'light' && isDarkMode) {
      isThemeChanging.current = true;
      setDarkMode(false);
      setTimeout(() => {
        isThemeChanging.current = false;
      }, 100);
    }
  }, [isDarkMode, setDarkMode, theme]);

  const fontSizeOptions = [
    { value: 'small', label: 'صغير', size: 'text-sm' },
    { value: 'medium', label: 'متوسط', size: 'text-base' },
    { value: 'large', label: 'كبير', size: 'text-lg' },
    { value: 'xlarge', label: 'كبير جداً', size: 'text-xl' }
  ]

  const fontFamilyOptions = [
    { value: 'amiri', label: 'أميري', class: 'font-["Amiri"]' },
    { value: 'noto', label: 'نوتو', class: 'font-["Noto_Sans_Arabic"]' },
    { value: 'cairo', label: 'القاهرة', class: 'font-["Cairo"]' }
  ]

  const lineHeightOptions = [
    { value: 'compact', label: 'مضغوط' },
    { value: 'normal', label: 'عادي' },
    { value: 'relaxed', label: 'واسع' }
  ]

  const textWidthOptions = [
    { value: 'narrow', label: 'ضيق' },
    { value: 'normal', label: 'عادي' },
    { value: 'wide', label: 'واسع' }
  ]

  // تحديث خيارات ألوان الخلفية ليناسب كل من الوضع الفاتح والداكن
  const backgroundOptions = isDarkMode 
    ? [
        { value: 'white', label: 'داكن', color: '#1a1a1a', border: true },
        { value: 'beige', label: 'بني داكن', color: '#2a2826' },
        { value: 'gray', label: 'رمادي داكن', color: '#202124' },
        { value: 'sepia', label: 'سيبيا داكن', color: '#2c2b25' }
      ]
    : [
        { value: 'white', label: 'أبيض', color: '#ffffff', border: true },
        { value: 'beige', label: 'بيج', color: '#f5f5dc' },
        { value: 'gray', label: 'رمادي', color: '#f8f9fa' },
        { value: 'sepia', label: 'سيبيا', color: '#fdf6e3' }
      ]

  return (
    <>
      {/* زر الإعدادات العائم */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="islamic"
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* لوحة الإعدادات */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* خلفية معتمة */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* اللوحة */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-2xl z-50 overflow-y-auto"
            >
              <Card className="h-full rounded-none border-0">
                <div className="p-6">
                  {/* رأس اللوحة */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold font-arabic">إعدادات القراءة</h2>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetToDefaults}
                        className="h-8 w-8"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* تبديل الوضع الداكن */}
                  <div className="mb-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDarkMode(!isDarkMode)}
                      className="w-full font-arabic flex items-center justify-between"
                    >
                      <span>{isDarkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}</span>
                      {isDarkMode ? (
                        <Sun className="h-4 w-4 ml-2" />
                      ) : (
                        <Moon className="h-4 w-4 ml-2" />
                      )}
                    </Button>
                  </div>

                  {/* حجم الخط */}
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <Type className="h-4 w-4 mr-2" />
                      <h3 className="font-semibold font-arabic">حجم الخط</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {fontSizeOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={fontSize === option.value ? 'islamic' : 'outline'}
                          size="sm"
                          onClick={() => setFontSize(option.value as any)}
                          className={`font-arabic ${option.size}`}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* نوع الخط */}
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <Type className="h-4 w-4 mr-2" />
                      <h3 className="font-semibold font-arabic">نوع الخط</h3>
                    </div>
                    <div className="space-y-2">
                      {fontFamilyOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={fontFamily === option.value ? 'islamic' : 'outline'}
                          size="sm"
                          onClick={() => setFontFamily(option.value as any)}
                          className={`w-full font-arabic ${option.class}`}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* ارتفاع السطر */}
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <AlignJustify className="h-4 w-4 mr-2" />
                      <h3 className="font-semibold font-arabic">المسافة بين الأسطر</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {lineHeightOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={lineHeight === option.value ? 'islamic' : 'outline'}
                          size="sm"
                          onClick={() => setLineHeight(option.value as any)}
                          className="font-arabic text-xs"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* عرض النص */}
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <Maximize className="h-4 w-4 mr-2" />
                      <h3 className="font-semibold font-arabic">عرض النص</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {textWidthOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={textWidth === option.value ? 'islamic' : 'outline'}
                          size="sm"
                          onClick={() => setTextWidth(option.value as any)}
                          className="font-arabic text-xs"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* لون الخلفية */}
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <Palette className="h-4 w-4 mr-2" />
                      <h3 className="font-semibold font-arabic">لون الخلفية</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {backgroundOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={backgroundColor === option.value ? 'islamic' : 'outline'}
                          size="sm"
                          onClick={() => setBackgroundColor(option.value as any)}
                          className="font-arabic text-xs flex items-center justify-center space-x-2 space-x-reverse"
                        >
                          <div 
                            className={`w-4 h-4 rounded-full ${option.border ? 'border border-border' : ''}`}
                            style={{ backgroundColor: option.color }}
                          />
                          <span>{option.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* معلومات إضافية */}
                  <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground font-arabic text-center">
                      ستُحفظ إعداداتك تلقائياً وستطبق على جميع المقالات
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
  