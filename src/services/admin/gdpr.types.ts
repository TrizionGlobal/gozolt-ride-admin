export type BreachSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type BreachStatus = 'REPORTED' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';

export interface DataBreach {
  id: string;
  reportedBy: string;
  reporterName: string;
  description: string;
  affectedUsers: number | null;
  dataTypes: string[];
  severity: BreachSeverity;
  status: BreachStatus;
  mitigationSteps: string | null;
  notifiedDpaAt: string | null;
  reportedAt: string;
  resolvedAt: string | null;
}

export interface DataRetentionConfig {
  userPurgeDays: number;
  supplierPurgeDays: number;
  financialRetentionYears: number;
  lastPurgeRun: string | null;
  nextPurgeRun: string;
  recordsPurged: number;
}

export interface CookieConsentStats {
  totalSessions: number;
  analyticsConsent: number;
  marketingConsent: number;
  essentialOnly: number;
}

export interface GdprKpis {
  openBreaches: number;
  pendingDeletions: number;
  dataExportsThisMonth: number;
  restrictedAccounts: number;
}

export interface ProcessingRestriction {
  userId: string;
  userName: string;
  restrictedAt: string;
  reason: string;
}

export interface CreateBreachPayload {
  description: string;
  severity: BreachSeverity;
  dataTypes: string[];
  affectedUsers: number | null;
}

export function getBreachSeverityDisplay(severity: BreachSeverity) {
  const map: Record<BreachSeverity, { label: string; className: string }> = {
    CRITICAL: { label: 'Critical', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    HIGH: { label: 'High', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    MEDIUM: { label: 'Medium', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    LOW: { label: 'Low', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  };
  return map[severity];
}

export function getBreachStatusDisplay(status: BreachStatus) {
  const map: Record<BreachStatus, { label: string; className: string }> = {
    REPORTED: { label: 'Reported', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    INVESTIGATING: { label: 'Investigating', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    CONTAINED: { label: 'Contained', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    RESOLVED: { label: 'Resolved', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  };
  return map[status];
}
