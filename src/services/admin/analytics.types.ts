// --- Analytics period ---
export type AnalyticsPeriod = '7d' | '30d' | '90d' | '1Y';

// --- KPI data ---
export interface AnalyticsKpis {
  totalRides: number;
  revenue: number;
  avgRideValue: number;
  activeUsers: number;
  changes: {
    totalRides: number;
    revenue: number;
    avgRideValue: number;
    activeUsers: number;
  };
}

// --- Chart data point ---
export interface ChartDataPoint {
  date: string;
  rides: number;
  revenue: number;
  users: number;
  categories: number;
}

// --- Analytics response bundle ---
export interface AnalyticsData {
  kpis: AnalyticsKpis;
  chartData: ChartDataPoint[];
}

// --- Tip analytics ---
export interface TipAnalytics {
  totalTips: number;
  totalTipAmount: number;
  avgTipPerRide: number;
  tipRate: number;
  tipTrend: { period: string; count: number; amount: number }[];
}

// --- Cancellation analytics ---
export interface CancellationAnalytics {
  totalCancellations: number;
  cancellationRate: number;
  byReason: { reason: string; count: number; percentage: number }[];
  byActor: { actor: 'USER' | 'DRIVER' | 'SYSTEM'; count: number }[];
}

// --- Period date helper ---
export function getPeriodDates(period: AnalyticsPeriod): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  switch (period) {
    case '7d':
      from.setDate(from.getDate() - 7);
      break;
    case '30d':
      from.setDate(from.getDate() - 30);
      break;
    case '90d':
      from.setDate(from.getDate() - 90);
      break;
    case '1Y':
      from.setFullYear(from.getFullYear() - 1);
      break;
  }
  return { from: from.toISOString(), to: to.toISOString() };
}
