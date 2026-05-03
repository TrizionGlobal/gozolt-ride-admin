import type {
  DataBreach,
  DataRetentionConfig,
  CookieConsentStats,
  GdprKpis,
  ProcessingRestriction,
} from './gdpr.types';

export const mockBreaches: DataBreach[] = [
  {
    id: 'breach-uuid-001',
    reportedBy: 'user-uuid-010',
    reporterName: 'Maria Zammit',
    description:
      'Unauthorized access to customer database via compromised API key. Financial and personal data of 850 users potentially exposed.',
    affectedUsers: 850,
    dataTypes: ['personal', 'financial'],
    severity: 'CRITICAL',
    status: 'RESOLVED',
    mitigationSteps:
      'API key revoked immediately. All affected users notified. Passwords force-reset. Full audit of API key management conducted.',
    notifiedDpaAt: '2024-01-02T09:00:00Z',
    reportedAt: '2024-01-02T08:30:00Z',
    resolvedAt: '2024-01-08T16:00:00Z',
  },
  {
    id: 'breach-uuid-002',
    reportedBy: 'user-uuid-011',
    reporterName: 'David Calleja',
    description:
      'Location data leak through improperly secured driver tracking endpoint. Personal and location data of active users accessible without authentication.',
    affectedUsers: 120,
    dataTypes: ['personal', 'location'],
    severity: 'HIGH',
    status: 'INVESTIGATING',
    mitigationSteps:
      'Endpoint temporarily disabled. Investigation into access logs in progress.',
    notifiedDpaAt: '2024-01-12T10:00:00Z',
    reportedAt: '2024-01-12T09:15:00Z',
    resolvedAt: null,
  },
  {
    id: 'breach-uuid-003',
    reportedBy: 'system-audit',
    reporterName: 'System Audit',
    description:
      'Routine audit detected identity document thumbnails cached in CDN without proper access controls.',
    affectedUsers: 0,
    dataTypes: ['identity'],
    severity: 'LOW',
    status: 'REPORTED',
    mitigationSteps: null,
    notifiedDpaAt: null,
    reportedAt: '2024-01-14T14:00:00Z',
    resolvedAt: null,
  },
  {
    id: 'breach-uuid-004',
    reportedBy: 'security-scanner',
    reporterName: 'Security Scanner',
    description:
      'Automated scan found personal data fields exposed in debug logs on staging environment.',
    affectedUsers: null,
    dataTypes: ['personal'],
    severity: 'LOW',
    status: 'REPORTED',
    mitigationSteps: null,
    notifiedDpaAt: null,
    reportedAt: '2024-01-15T11:30:00Z',
    resolvedAt: null,
  },
];

export const mockRetentionConfig: DataRetentionConfig = {
  userPurgeDays: 730,
  supplierPurgeDays: 1095,
  financialRetentionYears: 7,
  lastPurgeRun: '2024-01-10T03:00:00Z',
  nextPurgeRun: '2024-02-10T03:00:00Z',
  recordsPurged: 1247,
};

export const mockCookieConsentStats: CookieConsentStats = {
  totalSessions: 48200,
  analyticsConsent: 31400,
  marketingConsent: 12800,
  essentialOnly: 4000,
};

export const mockGdprKpis: GdprKpis = {
  openBreaches: 2,
  pendingDeletions: 5,
  dataExportsThisMonth: 12,
  restrictedAccounts: 3,
};

export const mockProcessingRestrictions: ProcessingRestriction[] = [
  {
    userId: 'user-uuid-020',
    userName: 'Joseph Borg',
    restrictedAt: '2024-01-05T10:00:00Z',
    reason: 'User requested processing restriction pending data accuracy review',
  },
  {
    userId: 'user-uuid-021',
    userName: 'Carmen Vella',
    restrictedAt: '2024-01-09T14:30:00Z',
    reason: 'Legal dispute regarding data usage for marketing purposes',
  },
  {
    userId: 'user-uuid-022',
    userName: 'Noel Farrugia',
    restrictedAt: '2024-01-13T08:15:00Z',
    reason: 'Pending investigation into unauthorized data sharing complaint',
  },
];
