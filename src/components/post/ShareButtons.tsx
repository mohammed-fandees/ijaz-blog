// src/components/post/ShareButtons.tsx
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Share2, 
  Copy, 
  MessageCircle, 
  Send,
  Mail,
  Link,
  Check
} from 'lucide-react'
import { FaWhatsapp, FaTelegram, FaTwitter, FaFacebook } from 'react-icons/fa'

interface ShareButtonsProps {
  post: {
    title: string
    slug: string
    excerpt?: string
  }
}

export function ShareButtons({ post }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? 
    `${window.location.origin}/posts/${post.slug}` : ''
  
  const shareText = `${post.title}\n\n${post.excerpt || 'مقال رائع من مدونة إعجاز'}`

  const shareLinks = [
    {
      name: 'واتساب',
      icon: FaWhatsapp,
      url: `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'تليجرام',
      icon: FaTelegram,
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'تويتر',
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'فيسبوك',
      icon: FaFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    }
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('فشل في نسخ الرابط:', error)
    }
  }

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400')
  }

  // Web Share API للأجهزة المحمولة
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || 'مقال من مدونة إعجاز',
          url: shareUrl
        })
      } catch (error) {
        console.error('فشل في المشاركة:', error)
      }
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      <div className="flex items-center space-x-2 space-x-reverse">
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="font-arabic"
        >
          <Share2 className="h-4 w-4 mr-1" />
          مشاركة
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="font-arabic"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1 text-green-600" />
              تم النسخ
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" />
              نسخ الرابط
            </>
          )}
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-arabic">مشاركة المقال</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* نسخ الرابط */}
            <div>
              <label className="text-sm font-medium font-arabic">رابط المقال:</label>
              <div className="flex items-center space-x-2 space-x-reverse mt-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="font-english text-sm"
                />
                <Button onClick={copyToClipboard} size="sm">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* أزرار المشاركة */}
            <div>
              <label className="text-sm font-medium font-arabic">مشاركة على:</label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {shareLinks.map((link) => {
                  const IconComponent = link.icon
                  return (
                    <Button
                      key={link.name}
                      onClick={() => handleShare(link.url)}
                      className={`${link.color} text-white font-arabic`}
                      size="sm"
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {link.name}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* إحصائيات المشاركة */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="font-arabic">تم مشاركة هذا المقال:</span>
                <Badge variant="secondary">47 مرة</Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
