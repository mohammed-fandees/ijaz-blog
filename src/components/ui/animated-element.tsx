'use client'

import React, { ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedElementProps {
  children: ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInRight' | 'fadeInLeft' | 'scale' | 'rotate';
  delay?: number;
  duration?: number;
  triggerOnce?: boolean;
  threshold?: number;
}

export default function AnimatedElement({
  children,
  className,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.5,
  triggerOnce = true,
  threshold = 0.1
}: AnimatedElementProps) {
  const animations = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    fadeInUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 }
    },
    fadeInRight: {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0 }
    },
    fadeInLeft: {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    },
    rotate: {
      hidden: { opacity: 0, rotate: -5 },
      visible: { opacity: 1, rotate: 0 }
    }
  }

  const ref = React.useRef(null)
  const isInView = useInView(ref, { 
    once: triggerOnce,
    amount: threshold
  })

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={animations[animation]}
      transition={{ 
        duration, 
        delay, 
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedContainer({ 
  children, 
  className,
  staggerChildren = 0.1,
  delay = 0,
  triggerOnce = true,
  threshold = 0.1
}: {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delay?: number;
  triggerOnce?: boolean;
  threshold?: number;
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay
      }
    }
  }

  const ref = React.useRef(null)
  const isInView = useInView(ref, { 
    once: triggerOnce,
    amount: threshold
  })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedItem({
  children,
  className,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.5,
}: Omit<AnimatedElementProps, 'triggerOnce' | 'threshold'>) {
  const animations = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: {
          duration,
          delay
        }
      }
    },
    fadeInUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration,
          delay
        }
      }
    },
    fadeInRight: {
      hidden: { opacity: 0, x: -30 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration,
          delay
        }
      }
    },
    fadeInLeft: {
      hidden: { opacity: 0, x: 30 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration,
          delay
        }
      }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration,
          delay
        }
      }
    },
    rotate: {
      hidden: { opacity: 0, rotate: -5 },
      visible: { 
        opacity: 1, 
        rotate: 0,
        transition: {
          duration,
          delay
        }
      }
    }
  }

  return (
    <motion.div
      className={cn(className)}
      variants={animations[animation]}
    >
      {children}
    </motion.div>
  )
} 