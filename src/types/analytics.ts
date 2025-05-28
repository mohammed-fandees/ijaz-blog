export interface PostAnalytics {
  id: string;
  title: string;
  views: number;
  avgTimeOnPage: number;
}

export interface DeviceStats {
  device: string;
  count: number;
  percentage: number;
}

export interface DailyViews {
  date: string;
  views: number;
}

export interface AnalyticsData {
  totalVisitors: number;
  totalViews: number;
  avgTimeOnSite: number;
  bounceRate: number;
  dailyViews: DailyViews[];
  deviceStats: DeviceStats[];
  topPosts: PostAnalytics[];
}

export interface TimeRangeOption {
  value: string;
  label: string;
  days: number;
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}
