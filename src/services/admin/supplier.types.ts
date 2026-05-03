import type { SupplierStatus, SubscriptionTier, DocumentType, DocumentStatus, PaginatedQuery, PaginatedResponse } from '@/types';

// --- Subscription ---
export interface SupplierSubscriptionSummary {
  tier: SubscriptionTier;
}

export interface SupplierSubscriptionDetail {
  id: string;
  tier: SubscriptionTier;
  maxVehicles: number;
  maxDrivers: number;
  stripePriceId: string | null;
  stripeSubId: string | null;
  currentPeriodEnd: string | null;
}

// --- Supplier list item (from GET /admin/suppliers) ---
export interface SupplierListItem {
  id: string;
  email: string;
  companyName: string;
  contactPhone: string | null;
  vatNumber: string | null;
  emailVerified: boolean;
  status: SupplierStatus;
  commissionRate: number;
  stripeAccountId: string | null;
  createdAt: string;
  updatedAt: string;
  subscription: SupplierSubscriptionSummary | null;
  _count: {
    drivers: number;
    vehicles: number;
  };
}

// --- Supplier detail (from GET /admin/suppliers/:id) ---
export interface SupplierDetail extends Omit<SupplierListItem, 'subscription' | '_count'> {
  subscription: SupplierSubscriptionDetail | null;
  tipSummary: {
    totalTipsReceived: number;
    totalTipsForwarded: number;
    pendingForwarding: number;
    driverBreakdown: { name: string; driverId: string; tipsOwed: number }[];
  } | null;
  revenueSummary: {
    totalRideRevenue: number;
    platformCommission: number;
    supplierEarnings: number;
    tipPassThrough: number;
    totalPaid: number;
    outstanding: number;
  } | null;
  _count: {
    drivers: number;
    vehicles: number;
    payouts: number;
  };
}

// --- Supplier document ---
export interface SupplierDocument {
  id: string;
  entityId: string;
  type: DocumentType;
  status: DocumentStatus;
  fileUrl: string | null;
  fileName: string | null;
  mimeType: string | null;
  expiresAt: string | null;
  createdAt: string;
}

// --- Filter / Query params ---
export interface SupplierFilterParams extends PaginatedQuery {
  status?: SupplierStatus;
  tier?: SubscriptionTier;
}

// --- Mutation payloads ---
export interface RejectSupplierPayload {
  reason: string;
}

export interface SuspendSupplierPayload {
  reason: string;
}

export interface ChangeCommissionPayload {
  commissionRate: number;
}

// --- Paginated response ---
export type SupplierListResponse = PaginatedResponse<SupplierListItem>;

// --- Display mappings ---
export const TIER_DISPLAY: Record<SubscriptionTier, string> = {
  STARTER: 'Standard',
  PROFESSIONAL: 'Professional',
  ENTERPRISE: 'Premium',
};

export const TIER_COLORS: Record<SubscriptionTier, string> = {
  STARTER: 'bg-yellow-900/50 text-yellow-400 border border-yellow-800',
  PROFESSIONAL: 'bg-blue-900/50 text-blue-400 border border-blue-800',
  ENTERPRISE: 'bg-purple-900/50 text-purple-400 border border-purple-800',
};

export const STATUS_DISPLAY: Record<SupplierStatus, string> = {
  PENDING_VERIFICATION: 'Pending',
  ACTIVE: 'Approved',
  SUSPENDED: 'Suspended',
  REJECTED: 'Rejected',
};

export const SUPPLIER_DOCUMENT_TYPES: { type: DocumentType; label: string }[] = [
  { type: 'OPERATOR_LICENSE' as DocumentType, label: 'Business License' },
  { type: 'INSURANCE' as DocumentType, label: 'Insurance Certificate' },
  { type: 'VAT_CERTIFICATE' as DocumentType, label: 'Tax Clearance' },
  { type: 'COMPANY_REGISTRATION' as DocumentType, label: 'Company Registration' },
];

export const REJECTION_REASONS = [
  'Incomplete Documentation',
  'Inactive Business License',
  'Failed Background Check',
  'Others',
] as const;
