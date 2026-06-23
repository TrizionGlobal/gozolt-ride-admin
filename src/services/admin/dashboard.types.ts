export interface DashboardKpi {
  activeRides: number;
  onlineDrivers: number;
  totalUsers: number;
  totalSuppliers: number;
  totalDrivers: number;
  todayRevenue: number;
  todayRides: number;
  pendingDocuments: number;
  pendingSupplierApprovals: number;
  tipRevenue: number;
}

export interface RideTrendPoint {
  period: string;
  count: number;
}

export interface RideTrendByVehicleType {
  period: string;
  vehicleType: string;
  count: number;
}

export interface RideTrends {
  totals: RideTrendPoint[];
  byVehicleType: RideTrendByVehicleType[];
}

export interface RevenueTrendPoint {
  period: string;
  revenue: number;
  commission: number;
  supplierPayouts: number;
  rideCount: number;
}

export interface VehicleTypeBreakdown {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ActionRequiredItem {
  label: string;
  count: number;
  color: string;
}

export interface LiveActivityItem {
  id: string;
  message: string;
  timestamp: string;
  type: 'ride' | 'driver' | 'supplier' | 'document' | 'payment';
}

export interface AnalyticsFilter {
  dateFrom?: string;
  dateTo?: string;
  period?: 'day' | 'week' | 'month';
}

export interface PeakHourItem {
  hour: number;
  rideCount: number;
  avgFare: number;
}

export interface PeakHoursData {
  byHour: PeakHourItem[];
  byHourAndDay: any[];
}

export interface DashboardAllResponse {
  kpis: DashboardKpi;
  rideTrends: RideTrends;
  revenueTrends: RevenueTrendPoint[];
  vehicleTypeBreakdown: VehicleTypeBreakdown[];
  actionRequired: ActionRequiredItem[];
  liveActivity: LiveActivityItem[];
  peakHours?: PeakHoursData;
}

