import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Combine Tailwind classes cleanly
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a timestamp into a relative time (e.g., "3 days ago")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / 1000 // difference in seconds

  const formatter = new Intl.RelativeTimeFormat("ar", { numeric: "auto" })

  const ranges: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "seconds"],
    [60 * 60, "minutes"],
    [60 * 60 * 24, "hours"],
    [60 * 60 * 24 * 7, "days"],
    [60 * 60 * 24 * 30, "weeks"],
    [60 * 60 * 24 * 365, "months"],
    [Infinity, "years"],
  ]

  const duration = diff
  for (const [threshold, unit] of ranges) {
    if (duration < threshold) {
      const value = Math.round(
        unit === "seconds" ? duration :
        unit === "minutes" ? duration / 60 :
        unit === "hours" ? duration / 3600 :
        unit === "days" ? duration / 86400 :
        unit === "weeks" ? duration / (86400 * 7) :
        unit === "months" ? duration / (86400 * 30) :
        duration / (86400 * 365)
      )
      return formatter.format(-value, unit)
    }
  }

  return formatter.format(-Math.round(duration / (86400 * 365)), "years")
}

// Truncate a string to a given length and add "..." if needed
export function truncateText(text: string, maxLength: number): string {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength).trim() + "..." : text
}

// Format data for display

export function formatDate(value: unknown): string {
  if (value === null || value === undefined) return '—';

  let date: Date | null = null;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      date = parsed;
    }
  }

  if (date) {
    // Format as "27 مايو 2025"
    return date.toLocaleDateString('ar-EG', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  return String(value);
}

/**
 * تنسيق الأرقام الكبيرة بشكل قابل للقراءة باللغة العربية
 * مثلا: 1000 -> 1 ألف، 1500 -> 1.5 ألف، 1000000 -> 1 مليون
 */
export function formatArabicNumber(number: number): string {
  if (number === undefined || number === null) return '0';
  
  if (number === 0) return '0';
  
  // تحويل مليون وأكثر
  if (number >= 1000000) {
    const millions = number / 1000000;
    // إذا كان العدد مليون بالضبط، لا نظهر الكسور
    if (millions === Math.floor(millions)) {
      return `${Math.floor(millions)} مليون`;
    }
    // وإلا نظهر رقم عشري واحد
    return `${millions.toFixed(1)} مليون`;
  }
  
  // تحويل ألف وأكثر
  if (number >= 1000) {
    const thousands = number / 1000;
    // إذا كان العدد ألف بالضبط، لا نظهر الكسور
    if (thousands === Math.floor(thousands)) {
      return `${Math.floor(thousands)} ألف`;
    }
    // وإلا نظهر رقم عشري واحد
    return `${thousands.toFixed(1)} ألف`;
  }
  
  // الأرقام الأقل من 1000 تظهر كما هي
  return number.toString();
}

/**
 * تنسيق الأرقام الكبيرة بإضافة فواصل كل 3 أرقام
 * مثلا: 1000 -> 1,000، 1000000 -> 1,000,000
 */
export function formatNumberWithCommas(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}