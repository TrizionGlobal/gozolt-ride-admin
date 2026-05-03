// --- Ticket enums ---
export type TicketCategory =
  | 'RIDE_ISSUE'
  | 'PAYMENT_ISSUE'
  | 'DRIVER_BEHAVIOR'
  | 'SAFETY_CONCERN'
  | 'LOST_ITEM'
  | 'APP_BUG'
  | 'ACCOUNT_ISSUE'
  | 'OTHER';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type DisputeStatus = 'open' | 'in_review' | 'resolved' | 'escalated' | 'closed';

export type DisputeTab = 'all' | 'open' | 'in_review' | 'resolved' | 'escalated';

// --- Category display ---
export const CATEGORY_DISPLAY: Record<TicketCategory, string> = {
  RIDE_ISSUE: 'Ride Issue',
  PAYMENT_ISSUE: 'Overcharge',
  DRIVER_BEHAVIOR: 'Driver Behavior',
  SAFETY_CONCERN: 'Safety Concern',
  LOST_ITEM: 'Lost Item',
  APP_BUG: 'App Bug',
  ACCOUNT_ISSUE: 'Account Issue',
  OTHER: 'Other',
};

// --- Status badge styles ---
export const DISPUTE_STATUS_STYLES: Record<
  DisputeStatus,
  { label: string; className: string }
> = {
  open: {
    label: 'Open',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  in_review: {
    label: 'In Review',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  escalated: {
    label: 'Escalated',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  closed: {
    label: 'Closed',
    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  },
};

// --- Tab config ---
export interface DisputeTabConfig {
  key: DisputeTab;
  label: string;
  countKey: 'open' | 'escalated' | null;
}

export const DISPUTE_TABS: DisputeTabConfig[] = [
  { key: 'all', label: 'All', countKey: null },
  { key: 'open', label: 'Open', countKey: 'open' },
  { key: 'in_review', label: 'In Review', countKey: null },
  { key: 'resolved', label: 'Resolved', countKey: null },
  { key: 'escalated', label: 'Escalated', countKey: 'escalated' },
];

// --- Reply ---
export interface DisputeReply {
  id: string;
  authorName: string;
  authorRole: 'USER' | 'ADMIN';
  message: string;
  createdAt: string;
}

// --- Dispute (mock-enriched) ---
export interface Dispute {
  id: string;
  userId: string;
  rideId: string | null;
  category: TicketCategory;
  subject: string;
  description: string;
  status: TicketStatus;
  assignedTo: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;

  // Mock display fields
  _displayId: string;
  _uiStatus: DisputeStatus;
  _isEscalated: boolean;
  _userName: string;
  _driverName: string;
  _rideAmount: number;
  _replyCount: number;
  _replies: DisputeReply[];
}

// --- KPIs ---
export interface DisputeKPIs {
  total: number;
  open: number;
  inReview: number;
  escalated: number;
  changes: {
    total: number | null;
    open: number | null;
    inReview: number | null;
    escalated: number | null;
  };
}

// --- Tab counts for badges ---
export interface DisputeTabCounts {
  open: number;
  escalated: number;
}
