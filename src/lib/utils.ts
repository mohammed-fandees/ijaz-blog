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

  if (typeof value === 'number') {
    return new Intl.NumberFormat().format(value); // e.g., 10000 → "10,000"
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 100 ? trimmed.slice(0, 97) + '...' : trimmed;
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  return String(value);
}