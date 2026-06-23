import type { UserStatus, VehicleType, PaginatedQuery, PaginatedResponse } from '@/types';

// --- User list item (from GET /admin/users, extended for UI) ---
export interface UserListItem {
  id: string;
  displayId: string;
  phone: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  status: UserStatus;
  createdAt: string;
  avgRating: number;
  _count: {
    rides: number;
  };
  // UI-only computed fields for devbypass
  _computed?: {
    preferredVehicle: VehicleType;
    totalSpent: number;
    paymentMethod: string;
    lastRideDate: string | null;
  };
}

// --- User detail (from GET /admin/users/:id) ---
export interface UserDetail {
  id: string;
  phone: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  city: string | null;
  country: string;
  status: UserStatus;
  avgRating: number;
  referralCode: string | null;
  stripeCustomerId: string | null;
  createdAt: string;
  addresses: { label: string; address: string }[];
  preferences: {
    preferredPayment: string;
    preferredVehicle: VehicleType;
    language: string;
  } | null;
  rewardAccount: {
    tier: string;
    totalPoints: number;
    currentPoints: number;
  } | null;
  recentRides: { id: string; displayId: string; date: string; pickup: string; dropoff: string; fare: number; tip: number | null; status: string }[];
  recentPayments: { id: string; amount: number; method: string; status: string; date: string; rideDisplayId: string | null }[];
  consentPreferences: { email: boolean; sms: boolean; push: boolean } | null;
  processingRestricted: boolean;
  processingRestrictedAt: string | null;
  _count: {
    rides: number;
    payments: number;
  };
}

// --- Filter params ---
export interface UserFilterParams extends PaginatedQuery {
  status?: UserStatus;
}

// --- Mutation payloads ---
export interface SuspendUserPayload {
  reason: string;
}

// --- Paginated response ---
export type UserListResponse = PaginatedResponse<UserListItem>;

// --- User KPI data ---
export interface UserKpis {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  inactiveUsers: number;
}

// --- Preferred vehicle display ---
export const PREFERRED_VEHICLE_DISPLAY: Record<VehicleType, { name: string; year: string; color: string }> = {
  GO: { name: 'Go', year: '2015+', color: 'bg-blue-500' },
  STANDARD: { name: 'Standard', year: '2018+', color: 'bg-green-500' },
  COMFORT: { name: 'Comfort', year: '2020+', color: 'bg-yellow-500' },
  GREEN: { name: 'Green', year: '2021+', color: 'bg-teal-500' },
  PRIME: { name: 'Prime', year: '2022+', color: 'bg-amber-500' },
  PREMIUM_XL: { name: 'Premium XL', year: '2018+', color: 'bg-purple-500' },
  VAN: { name: 'Van', year: '2018+', color: 'bg-indigo-500' },
  CHAUFFEUR: { name: 'Chauffeur', year: '2022+', color: 'bg-slate-800' },
};

// --- Status display utility ---
export function getUserStatusDisplay(status: UserStatus) {
  const map: Record<string, { label: string; className: string }> = {
    ACTIVE: { label: 'Active', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    SUSPENDED: { label: 'Banned', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    DELETED: { label: 'Inactive', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  };
  return map[status] ?? { label: status, className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
}
