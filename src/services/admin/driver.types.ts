import type { DriverStatus, PaginatedQuery, PaginatedResponse } from '@/types';

// --- Vehicle in assignment ---
export interface AssignedVehicleSummary {
  plateNumber: string;
  make: string;
  model: string;
}

// --- Driver list item (from GET /admin/drivers) ---
export interface DriverListItem {
  id: string;
  driverId: string;
  supplierId: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string | null;
  status: DriverStatus;
  isOnline: boolean;
  avgRating: number;
  totalRides: number;
  createdAt: string;
  updatedAt: string;
  supplier: {
    companyName: string;
  };
  vehicleAssignment: {
    vehicle: AssignedVehicleSummary;
  } | null;
  // UI-only computed fields for devbypass
  _computed?: {
    totalEarnings: number;
    docsStatus: 'verified' | 'pending' | 'expired';
  };
}

// --- Driver detail (from GET /admin/drivers/:id) ---
export interface DriverDetail extends Omit<DriverListItem, 'supplier' | 'vehicleAssignment'> {
  supplier: {
    id: string;
    companyName: string;
  };
  vehicleAssignment: {
    vehicle: {
      id: string;
      make: string;
      model: string;
      year: number;
      color: string;
      plateNumber: string;
      type: string;
      seats: number;
    };
  } | null;
  earningsBalance: {
    totalEarnings: number;
    totalPaidOut: number;
    pendingPenalties: number;
    availableBalance: number;
  } | null;
  _count: {
    rides: number;
    ratings: number;
    documents: number;
  };
}

// --- Driver detail extended (earnings, rides, shifts, selfie verifications) ---
export interface DriverDetailExtended {
  earnings: { totalEarnings: number; cashEarnings: number; cardEarnings: number; tipEarnings: number; tipCount: number; ridesCompleted: number };
  recentRides: { id: string; displayId: string; date: string; pickup: string; dropoff: string; fare: number; tip: number | null; status: string; riderName: string }[];
  shifts: { id: string; startedAt: string; endedAt: string | null; durationMinutes: number | null }[];
  selfieVerifications: { verifiedAt: string; isMatch: boolean; confidence: number }[];
}

// --- Filter params ---
export interface DriverFilterParams extends PaginatedQuery {
  status?: DriverStatus;
  supplierId?: string;
  onlineOnly?: boolean;
}

// --- Mutation payloads ---
export interface SuspendDriverPayload {
  reason: string;
}

// --- Paginated response ---
export type DriverListResponse = PaginatedResponse<DriverListItem>;

// --- Driver KPI data ---
export interface DriverKpis {
  activeDrivers: number;
  onlineNow: number;
  pendingApproval: number;
  suspended: number;
}

// --- Status display utility ---
export function getDriverStatusDisplay(status: DriverStatus, isOnline: boolean) {
  if (status === 'ACTIVE') {
    return isOnline
      ? { label: 'Online', className: 'bg-green-500/20 text-green-400 border-green-500/30' }
      : { label: 'Offline', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  }
  const map: Record<string, { label: string; className: string }> = {
    PENDING_APPROVAL: { label: 'pending', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    SUSPENDED: { label: 'Suspend', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    INACTIVE: { label: 'Offline', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  };
  return map[status] ?? { label: status, className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
}
