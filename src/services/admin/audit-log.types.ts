import type { PaginatedQuery, PaginatedResponse } from '@/types';

// --- Audit log entry ---
export interface AuditLogItem {
  id: string;
  _displayId: string;
  entityType: string;
  entityId: string;
  action: string;
  actorId: string;
  actorRole: string;
  _actorEmail: string;
  before: object | null;
  after: object | null;
  ipAddress: string | null;
  createdAt: string;
}

// --- Filter params ---
export interface AuditLogFilterParams extends PaginatedQuery {
  entityType?: string;
  action?: string;
  actorId?: string;
  from?: string;
  to?: string;
}

// --- Paginated response ---
export type AuditLogListResponse = PaginatedResponse<AuditLogItem>;

// --- Action display mapping ---
export const ACTION_DISPLAY: Record<string, string> = {
  CREATE: 'Create',
  UPDATE: 'PATCH',
  APPROVE: 'Approve',
  REJECT: 'Reject',
  SUSPEND: 'Suspend',
  ACTIVATE: 'Activate',
  DELETE: 'Delete',
  EXPORT: 'Export',
  FORCE_LOGOUT: 'Logout',
  ISSUE_REFUND: 'Refund',
  ADMIN_CANCEL: 'Cancel',
  TRIGGER_PAYOUT: 'Payout',
};

// --- Action badge colors ---
export const ACTION_BADGE_COLORS: Record<string, string> = {
  CREATE: 'bg-green-500/20 text-green-400 border-green-500/30',
  UPDATE: 'bg-red-500/20 text-red-400 border-red-500/30',
  APPROVE: 'bg-green-500/20 text-green-400 border-green-500/30',
  REJECT: 'bg-red-500/20 text-red-400 border-red-500/30',
  SUSPEND: 'bg-red-500/20 text-red-400 border-red-500/30',
  ACTIVATE: 'bg-green-500/20 text-green-400 border-green-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
  EXPORT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  FORCE_LOGOUT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  ISSUE_REFUND: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  ADMIN_CANCEL: 'bg-red-500/20 text-red-400 border-red-500/30',
  TRIGGER_PAYOUT: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

// --- Entity type options for filter ---
export const ENTITY_TYPES = [
  'Settings',
  'Suppliers',
  'Ride',
  'User',
  'Vehicle',
  'Driver',
  'Document',
  'SurgeZone',
  'Payout',
];

// --- Action options for filter ---
export const ACTION_TYPES = [
  'CREATE',
  'UPDATE',
  'APPROVE',
  'REJECT',
  'SUSPEND',
  'ACTIVATE',
  'DELETE',
  'EXPORT',
  'FORCE_LOGOUT',
  'ISSUE_REFUND',
  'ADMIN_CANCEL',
  'TRIGGER_PAYOUT',
];

// --- Mock admin list ---
export const ADMIN_LIST = [
  { id: 'admin-uuid-001', email: 'admin@rideapp.mt' },
  { id: 'admin-uuid-002', email: 'ops@rideapp.mt' },
];
