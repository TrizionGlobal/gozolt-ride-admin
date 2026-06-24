import type { VehicleStatus, VehicleType, FuelType, PaginatedQuery, PaginatedResponse } from '@/types';

// --- Nested summary for list ---
export interface AssignedDriverSummary {
  firstName: string;
  lastName: string;
  driverId: string;
}

// --- Vehicle list item (from GET /admin/vehicles) ---
export interface VehicleListItem {
  id: string;
  supplierId: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  vin: string | null;
  fuelType: FuelType;
  seats: number;
  status: VehicleStatus;
  photoUrls: string[];
  createdAt: string;
  updatedAt: string;
  supplier: {
    companyName: string;
  };
  assignment: {
    driver: AssignedDriverSummary;
  } | null;
  // UI-only computed fields for devbypass
  _computed?: {
    inspectionDate: string;
  };
}

// --- Vehicle detail (from GET /admin/vehicles/:id) ---
export interface VehicleDetail extends Omit<VehicleListItem, 'supplier' | 'assignment'> {
  supplier: {
    id: string;
    companyName: string;
  };
  assignment: {
    driver: {
      id: string;
      firstName: string;
      lastName: string;
      driverId: string;
      phone: string;
    };
  } | null;
  documents: {
    id: string;
    type: string;
    url: string;
    status: string;
  }[];
  _count: {
    maintenanceLogs: number;
  };
}

// --- Filter params ---
export interface VehicleFilterParams extends PaginatedQuery {
  status?: VehicleStatus;
  type?: VehicleType;
  supplierId?: string;
}

// --- Mutation payloads ---
export interface SuspendVehiclePayload {
  reason: string;
}

export interface RejectVehiclePayload {
  reason: string;
}

// --- Paginated response ---
export type VehicleListResponse = PaginatedResponse<VehicleListItem>;

// --- Vehicle KPI data ---
export interface VehicleKpis {
  totalVehicles: number;
  activeOnRoad: number;
  pendingInspection: number;
  suspended: number;
}

// --- Status display utility ---
export function getVehicleStatusDisplay(status: VehicleStatus) {
  const map: Record<string, { label: string; className: string }> = {
    ACTIVE: { label: 'Active', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    PENDING_APPROVAL: { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    SUSPENDED: { label: 'Suspended', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    MAINTENANCE: { label: 'Maintenance', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    DECOMMISSIONED: { label: 'Inactive', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  };
  return map[status] ?? { label: status, className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
}
