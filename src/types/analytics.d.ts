export interface AnalyticsData {
  visitors: number;
  pageViews: number;
  avgTimeOnSite: number;
  bounceRate: number;
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface AnalyticsFilters {
  timeRange: string;
  startDate?: Date;
  endDate?: Date;
}
