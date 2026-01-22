export interface Expense {
  id: string;
  amount: number;
  description: string;
  category?: string;
  date: string;
  notes?: string;
}

export interface DailyMetric {
  today: number;
  yesterday: number;
}

export interface WeeklyMetric {
  thisWeek: number;
  lastWeek: number;
}

export interface MonthlyMetric {
  thisMonth: number;
  lastMonth: number;
}

export interface DashboardMetrics {
  daily: DailyMetric;
  weekly: WeeklyMetric;
  monthly: MonthlyMetric;
}

export interface DailyAggregate {
  date: string;
  total: number;
}

export interface WeeklyAggregate {
  year: number;
  week: number;
  total: number;
}

export interface MonthlyAggregate {
  year: number;
  month: number;
  total: number;
}

export type FrequencyType = "daily" | "weekly" | "monthly";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
