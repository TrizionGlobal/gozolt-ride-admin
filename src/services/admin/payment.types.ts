import type { PaginatedQuery, PaginatedResponse } from '@/types';

// --- Transaction type for unified view ---
export type TransactionType = 'ride' | 'payout' | 'refund' | 'tip';

// --- Unified transaction (merged view for UI) ---
export interface UnifiedTransaction {
  id: string;                   // Display ID: "TXN-4821"
  _rawId: string;               // Actual UUID
  type: TransactionType;
  description: string;          // "Ride #R-4821 Sarah Johnson"
  amount: number;
  status: string;               // 'completed' | 'pending' | 'failed' | 'processing'
  method: string;               // "Visa •••• 4242", "Cash", "Bank Transfer"
  supplier: string;             // Supplier company name
  commission: number;           // Platform fee
  date: string;                 // ISO date
  _paymentId?: string;
  _payoutId?: string;
  _refundId?: string;
  _rideId?: string;
  details?: Record<string, any>;
}

// --- Settled balance response ---
export interface SettledBalanceResponse {
  availableToPayout: number;
  totalSettledEarned: number;
  totalPenaltyEarned: number;
  totalCashCollected: number;
  totalAlreadyPaid: number;
  totalEarnedAllTime: number;
  totalPendingBalance: number;
  lastPaidDate: string | null;
  nextSettlementDate: string;
  isPayable: boolean;
  supplierBankName: string | null;
  supplierAccountHolder: string | null;
  supplierAccountNumber: string | null;
}

// --- Filter params for unified transactions ---
export interface TransactionFilterParams extends PaginatedQuery {
  type?: TransactionType;
  status?: string;
}

// --- Trigger payout payload ---
export interface TriggerPayoutPayload {
  supplierId: string;
  supplierName: string;
  amount: number;
  periodStart?: string;
  periodEnd?: string;
  module?: 'CAB' | 'RENTAL';
}

// --- Payment KPIs ---
export interface PaymentKpis {
  todayRevenue: number;
  pendingPayoutsAmount: number;
  pendingSuppliersCount: number;
  completedPayoutsAmount: number;
  completedSuppliersCount: number;
  overduePayoutsAmount: number;
  overdueSuppliersCount: number;
}

// --- Paginated response ---
export type TransactionListResponse = PaginatedResponse<UnifiedTransaction>;

export interface SettlementListItem {
  id: string;
  companyName: string;
  email: string;
  totalSettledEarned: number;
  totalPenaltyEarned: number;
  totalAlreadyPaid: number;
  availableToPayout: number;
  totalEarnedAllTime: number;
  totalPendingBalance: number;
  lastPaidDate: string | null;
  nextSettlementDate: string;
  isPayable: boolean;
}

export type SettlementListResponse = PaginatedResponse<SettlementListItem>;

// --- Transaction type display ---
export function getTransactionTypeDisplay(type: string | undefined) {
  if (!type) {
    return { label: 'Payment', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  }
  const map: Record<string, { label: string; className: string }> = {
    ride: { label: 'Ride', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    payout: { label: 'Payouts', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    refund: { label: 'Refund', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    tip: { label: 'Tip', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  };
  return map[type] || { label: type, className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
}

export function getPaymentStatusDisplay(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    completed: { label: 'Completed', className: 'text-green-400' },
    pending: { label: 'Pending', className: 'text-yellow-400' },
    authorized: { label: 'Authorized', className: 'text-blue-400' },
    failed: { label: 'Failed', className: 'text-red-400' },
    processing: { label: 'Processing', className: 'text-blue-400' },
    refunded: { label: 'Refunded', className: 'text-orange-400' },
  };
  return map[status] ?? { label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(), className: 'text-gray-400' };
}
