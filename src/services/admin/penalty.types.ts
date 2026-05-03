import type { PaginatedQuery, PaginatedResponse } from '@/types';

// --- Penalty types ---
export type PenaltyType = 'LATE_CANCELLATION' | 'NO_SHOW' | 'DAMAGE' | 'POLICY_VIOLATION';
export type PenaltyStatus = 'PENDING' | 'APPLIED' | 'VOIDED' | 'PAID';
export type PenaltyEntityType = 'DRIVER' | 'SUPPLIER';

// --- Penalty transaction ---
export interface PenaltyTransaction {
  id: string;
  entityId: string;
  entityType: PenaltyEntityType;
  type: PenaltyType;
  status: PenaltyStatus;
  amount: number;
  reason: string;
  rideId: string | null;
  voidedBy: string | null;
  voidedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Mock-only fields for display
  _displayId: string;
  _entityName: string;
  _entityDisplayId: string;
  _typeName: string;
}

// --- KPIs ---
export interface PenaltyKPIs {
  pending: number;
  applied: number;
  voided: number;
  paid: number;
}

// --- Filter params ---
export interface PenaltyFilterParams extends PaginatedQuery {
  type?: PenaltyType;
  entityType?: PenaltyEntityType;
  status?: PenaltyStatus;
  from?: string;
  to?: string;
}

// --- Paginated response ---
export type PenaltyListResponse = PaginatedResponse<PenaltyTransaction>;

// --- Display mappings ---
export const PENALTY_TYPE_DISPLAY: Record<PenaltyType, string> = {
  LATE_CANCELLATION: 'Cancellation Abuse',
  NO_SHOW: 'No Show',
  DAMAGE: 'Unsafe Driving',
  POLICY_VIOLATION: 'Policy Violation',
};

export const PENALTY_STATUS_STYLES: Record<PenaltyStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  APPLIED: { label: 'Applied', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  VOIDED: { label: 'Voided', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  PAID: { label: 'Paid', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

// --- Filter options ---
export const PENALTY_TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'LATE_CANCELLATION', label: 'Cancellation Abuse' },
  { value: 'NO_SHOW', label: 'No Show' },
  { value: 'DAMAGE', label: 'Unsafe Driving' },
  { value: 'POLICY_VIOLATION', label: 'Policy Violation' },
] as const;

export const ENTITY_TYPE_OPTIONS = [
  { value: '', label: 'All Entities' },
  { value: 'DRIVER', label: 'Driver' },
  { value: 'SUPPLIER', label: 'Supplier' },
] as const;

export const PENALTY_STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'VOIDED', label: 'Voided' },
  { value: 'PAID', label: 'Paid' },
] as const;
