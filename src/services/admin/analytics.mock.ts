import type { AnalyticsKpis, ChartDataPoint, TipAnalytics, CancellationAnalytics } from './analytics.types';

// --- KPI data ---
export const mockAnalyticsKpis: AnalyticsKpis = {
  totalRides: 38421,
  revenue: 142580,
  avgRideValue: 12.40,
  activeUsers: 8421,
  changes: {
    totalRides: 12,
    revenue: 18,
    avgRideValue: 12,
    activeUsers: 12,
  },
};

// --- Generate chart data for N days ---
export function generateChartData(days: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({
      date: i === 0 ? 'Today' : `${d.getDate()}/${d.getMonth() + 1}`,
      rides: 800 + Math.floor(Math.random() * 600),
      revenue: 600 + Math.floor(Math.random() * 800),
      users: 200 + Math.floor(Math.random() * 1200),
      categories: 100 + Math.floor(Math.random() * 1300),
    });
  }
  return data;
}

// --- Tip analytics mock ---
export function generateTipTrend(days: number): TipAnalytics['tipTrend'] {
  const data: TipAnalytics['tipTrend'] = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({
      period: i === 0 ? 'Today' : `${d.getDate()}/${d.getMonth() + 1}`,
      count: 20 + Math.floor(Math.random() * 40),
      amount: 40 + Math.floor(Math.random() * 80),
    });
  }
  return data;
}

export const mockTipAnalytics: TipAnalytics = {
  totalTips: 1842,
  totalTipAmount: 8460,
  avgTipPerRide: 2.35,
  tipRate: 34.2,
  tipTrend: generateTipTrend(30),
};

// --- Cancellation analytics mock ---
export const mockCancellationAnalytics: CancellationAnalytics = {
  totalCancellations: 342,
  cancellationRate: 8.2,
  byReason: [
    { reason: 'Changed mind', count: 137, percentage: 40 },
    { reason: 'Driver too far', count: 86, percentage: 25 },
    { reason: 'No show', count: 68, percentage: 20 },
    { reason: 'Price too high', count: 34, percentage: 10 },
    { reason: 'Other', count: 17, percentage: 5 },
  ],
  byActor: [
    { actor: 'USER', count: 210 },
    { actor: 'DRIVER', count: 95 },
    { actor: 'SYSTEM', count: 37 },
  ],
};
