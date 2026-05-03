import type {
  DashboardKpi,
  RideTrends,
  RevenueTrendPoint,
  VehicleTypeBreakdown,
  ActionRequiredItem,
  LiveActivityItem,
} from './dashboard.types';

export const dashboardMockData = {
  kpis: {
    activeRides: 127,
    onlineDrivers: 284,
    totalUsers: 14832,
    totalSuppliers: 48,
    totalDrivers: 284,
    todayRevenue: 8421,
    todayRides: 1247,
    pendingDocuments: 14,
    pendingSupplierApprovals: 3,
    tipRevenue: 1240,
  } satisfies DashboardKpi,

  rideTrends: {
    totals: Array.from({ length: 30 }, (_, i) => ({
      period: `2026-02-${String(i + 1).padStart(2, '0')}`,
      count: Math.floor(Math.random() * 80) + 40,
    })),
    byVehicleType: [],
  } satisfies RideTrends,

  revenueTrends: Array.from({ length: 30 }, (_, i) => ({
    period: `2026-02-${String(i + 1).padStart(2, '0')}`,
    revenue: Math.floor(Math.random() * 5000) + 3000,
    commission: Math.floor(Math.random() * 1000) + 500,
    supplierPayouts: Math.floor(Math.random() * 3000) + 2000,
    rideCount: Math.floor(Math.random() * 80) + 40,
  })) satisfies RevenueTrendPoint[],

  vehicleTypeBreakdown: [
    { type: 'Standard', count: 562, percentage: 45, color: '#FACC15' },
    { type: 'Premium', count: 325, percentage: 26, color: '#A855F7' },
    { type: 'Electric', count: 237, percentage: 19, color: '#22C55E' },
    { type: 'XL', count: 123, percentage: 10, color: '#3B82F6' },
  ] satisfies VehicleTypeBreakdown[],

  actionRequired: [
    { label: 'Pending Approvals', count: 12, color: '#F59E0B' },
    { label: 'Doc Reviews', count: 14, color: '#F59E0B' },
    { label: 'Expired Docs', count: 5, color: '#EF4444' },
    { label: 'Active Disputes', count: 3, color: '#EF4444' },
    { label: 'Pending Payouts', count: 8, color: '#F59E0B' },
    { label: 'Vending Reports', count: 2, color: '#F59E0B' },
  ] satisfies ActionRequiredItem[],

  liveActivity: [
    {
      id: '1',
      message: 'New Ride request #R-4621',
      timestamp: '2m ago',
      type: 'ride',
    },
    {
      id: '2',
      message: 'Driver M. Borg went online',
      timestamp: '5m ago',
      type: 'driver',
    },
    {
      id: '3',
      message: "Supplier 'Malta Cabs' approved",
      timestamp: '15m ago',
      type: 'supplier',
    },
    {
      id: '4',
      message: 'Ride #R-4819 completed - €14.50',
      timestamp: '22m ago',
      type: 'ride',
    },
    {
      id: '5',
      message: 'Document rejected - Driver ID expired',
      timestamp: '45m ago',
      type: 'document',
    },
    {
      id: '6',
      message: 'New payout processed - €2,340',
      timestamp: '1h ago',
      type: 'payment',
    },
  ] satisfies LiveActivityItem[],
};
