import type { RideStatus, VehicleType, PaymentMethod, PaymentStatus, Role, PaginatedQuery, PaginatedResponse } from '@/types';

// --- Ride list item (from GET /admin/rides) ---
export interface RideListItem {
  id: string;
  userId: string;
  driverId: string | null;
  vehicleType: VehicleType;
  status: RideStatus;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  distanceKm: number | null;
  durationMinutes: number | null;
  estimatedFare: number;
  actualFare: number | null;
  surgeMultiplier: number;
  paymentMethod: PaymentMethod;
  requestedAt: string;
  acceptedAt: string | null;
  arrivedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  user: { firstName: string | null; lastName: string | null; phone: string | null };
  driver: { firstName: string; lastName: string; driverId: string } | null;
  baseFare: number | null;
  distanceFare: number | null;
  timeFare: number | null;
  waitTimeFee: number | null;
  bookingFee: number | null;
  tip: { amount: number; createdAt: string } | null;
  // UI-only computed fields for devbypass
  _displayId: string;
  _supplierName: string | null;
  _isDisputed?: boolean;
}

// --- Ride stop ---
export interface RideStop {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  stopOrder: number;
  arrivedAt: string | null;
}

// --- Refund ---
export interface Refund {
  id: string;
  amount: number;
  reason: string;
  processedBy: string | null;
  createdAt: string;
}

// --- Ride detail (from GET /admin/rides/:id) ---
export interface RideDetail extends RideListItem {
  user: { id: string; firstName: string | null; lastName: string | null; phone: string | null };
  driver: { id: string; firstName: string; lastName: string; driverId: string } | null;
  stops: RideStop[];
  cancellation: {
    cancelledBy: Role;
    reason: string | null;
    fee: number | null;
    cancelledAt: string;
  } | null;
  payment: {
    id: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    refunds: Refund[];
  } | null;
  ratings: { rating: number; comment: string | null }[];
  riderRatings: { rating: number; comment: string | null }[];
  destinationChanges: {
    id: string;
    oldDropoffAddress: string;
    newDropoffAddress: string;
    oldEstimatedFare: number;
    newEstimatedFare: number;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
  }[];
}

// --- Filter params ---
export interface RideFilterParams extends PaginatedQuery {
  status?: RideStatus;
  driverId?: string;
  userId?: string;
  disputed?: boolean;
  from?: string;
  to?: string;
}

// --- Mutation payloads ---
export interface IssueRefundPayload {
  amount: number;
  reason: string;
}

export interface AdminCancelRidePayload {
  reason: string;
}

// --- Paginated response ---
export type RideListResponse = PaginatedResponse<RideListItem>;

// --- Status display utility ---
export function getRideStatusDisplay(status: RideStatus) {
  const map: Record<string, { label: string; className: string }> = {
    SCHEDULED: { label: 'Scheduled', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    REQUESTED: { label: 'Requested', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    ACCEPTED: { label: 'Accepted', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    DRIVER_EN_ROUTE: { label: 'En Route', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    DRIVER_ARRIVED: { label: 'At Pickup', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    IN_PROGRESS: { label: 'In Progress', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    COMPLETED: { label: 'Completed', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    CANCELLED: { label: 'Cancelled', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    NO_DRIVERS: { label: 'Cancelled', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    NO_SHOW_USER: { label: 'No Show (Rider)', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    NO_SHOW_DRIVER: { label: 'No Show (Driver)', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  };
  return map[status] ?? { label: status, className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
}

// --- Vehicle type badge display ---
export function getRideTypeDisplay(type: VehicleType) {
  const map: Record<string, { label: string; className: string }> = {
    ECONOMY: { label: 'Economy', className: 'bg-slate-700/50 text-slate-300 border-slate-600/30' },
    STANDARD: { label: 'Standard', className: 'bg-yellow-900/50 text-yellow-400 border-yellow-700/30' },
    PREMIUM: { label: 'Premium', className: 'bg-purple-900/50 text-purple-400 border-purple-700/30' },
    XL: { label: 'XL', className: 'bg-blue-900/50 text-blue-300 border-blue-700/30' },
    ELECTRIC: { label: 'Electric', className: 'bg-green-900/50 text-green-400 border-green-700/30' },
  };
  return map[type] ?? { label: type, className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
}
