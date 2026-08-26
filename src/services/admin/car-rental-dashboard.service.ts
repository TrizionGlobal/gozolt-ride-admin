import { apiClient } from '@/lib/api-client';

export interface CarRentalDashboardStats {
  kpis: {
    pendingAcceptance: number;
    upcomingHandovers: number;
    activeRentals: number;
    totalVehicles: number;
    totalSuppliers: number;
    fleetUtilizationRate: number;
  };
  lifecyclePipeline: {
    pendingPayment: number;
    pendingAcceptance: number;
    confirmedHandover: number;
    activeOnRoad: number;
    completed: number;
  };
  handoverTypes: {
    doorstepDelivery: number;
    selfPickup: number;
  };
  fleetStatus: {
    available: number;
    onRent: number;
    maintenance: number;
  };
  weeklyActivity: Array<{
    day: string;
    count: number;
  }>;
  supplierFleetOverview: Array<{
    id: string;
    supplierName: string;
    email: string;
    phone: string | null;
    totalVehicles: number;
    availableVehicles: number;
    activeRentals: number;
  }>;
}

export const carRentalDashboardService = {
  async getDashboardStats(): Promise<CarRentalDashboardStats> {
    try {
      const { data } = await apiClient.get<CarRentalDashboardStats>('/admin/car-rentals/dashboard-stats');
      return data;
    } catch {
      return {
        kpis: {
          pendingAcceptance: 0,
          upcomingHandovers: 0,
          activeRentals: 0,
          totalVehicles: 0,
          totalSuppliers: 0,
          fleetUtilizationRate: 0,
        },
        lifecyclePipeline: {
          pendingPayment: 0,
          pendingAcceptance: 0,
          confirmedHandover: 0,
          activeOnRoad: 0,
          completed: 0,
        },
        handoverTypes: {
          doorstepDelivery: 0,
          selfPickup: 0,
        },
        fleetStatus: {
          available: 0,
          onRent: 0,
          maintenance: 0,
        },
        weeklyActivity: [
          { day: 'Sun', count: 0 },
          { day: 'Mon', count: 0 },
          { day: 'Tue', count: 0 },
          { day: 'Wed', count: 0 },
          { day: 'Thu', count: 0 },
          { day: 'Fri', count: 0 },
          { day: 'Sat', count: 0 },
        ],
        supplierFleetOverview: [],
      };
    }
  },
};
