// --- Analytics period ---
export interface DateRange {
  from: string;
  to: string;
}

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
  cancellations: CancellationAnalytics;
}



// --- Cancellation analytics ---
export interface CancellationAnalytics {
  totalCancellations: number;
  cancellationRate: number;
  byReason: { reason: string; count: number; percentage: number }[];
  byActor: { actor: 'USER' | 'DRIVER' | 'SYSTEM'; count: number }[];
}


