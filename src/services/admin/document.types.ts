import type { DocumentStatus, DocumentType, PaginatedQuery, PaginatedResponse } from '@/types';

// --- Entity type for document owner ---
export type DocumentEntityType = 'driver' | 'supplier';

// --- Entity summary for document list ---
export interface DocumentEntitySummary {
  id: string;
  name: string;
  displayId: string;
  entityType: DocumentEntityType;
}

// --- Document list item (from GET /admin/documents) ---
export interface DocumentListItem {
  id: string;
  type: DocumentType;
  status: DocumentStatus;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  expiresAt: string | null;
  rejectionReason: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  createdAt: string;
  updatedAt: string;
  entity: DocumentEntitySummary;
  // UI-only computed fields for devbypass
  _computed?: {
    submittedAgo: string;
    isAutoSuspended: boolean;
  };
}

// --- Document detail (from GET /admin/documents/:id) ---
export interface DocumentDetail extends DocumentListItem {
  requirements: DocumentRequirement[];
  adminNotes: string | null;
}

// --- Requirements checklist ---
export interface DocumentRequirement {
  label: string;
  met: boolean;
}

// --- Filter params ---
export interface DocumentFilterParams extends PaginatedQuery {
  status?: DocumentStatus;
  entityType?: DocumentEntityType;
  documentType?: DocumentType;
}

// --- Mutation payloads ---
export interface ApproveDocumentPayload {
  notes?: string;
}

export interface RejectDocumentPayload {
  reason: string;
  details?: string;
}

// --- Paginated response ---
export type DocumentListResponse = PaginatedResponse<DocumentListItem>;

// --- Document KPI data ---
export interface DocumentKpis {
  pendingReview: number;
  approved: number;
  rejected: number;
  expiringSoon: number;
}

// --- Document type display utility ---
export function getDocumentTypeDisplay(type: DocumentType): string {
  const map: Record<string, string> = {
    DRIVING_LICENSE: 'Driving License',
    VEHICLE_REGISTRATION: 'Vehicle Registration',
    INSURANCE: 'Insurance Certificate',
    ROADWORTHINESS: 'Roadworthiness Cert',
    POLICE_CLEARANCE: 'Police Clearance',
    MEDICAL_CERTIFICATE: 'Medical Certificate',
    TAXI_LICENSE: 'Taxi License',
    OPERATOR_LICENSE: 'Operator License',
    COMPANY_REGISTRATION: 'Company Registration',
    VAT_CERTIFICATE: 'VAT Certificate',
    VEHICLE_PHOTO_FRONT: 'Vehicle Photo (Front)',
    VEHICLE_PHOTO_BACK: 'Vehicle Photo (Back)',
    VEHICLE_PHOTO_SIDE: 'Vehicle Photo (Side)',
    VEHICLE_PHOTO_INTERIOR: 'Vehicle Photo (Interior)',
    PROFILE_PHOTO: 'Profile Photo',
    ID_CARD: 'ID Card',
  };
  return map[type] ?? type;
}

// --- Status display utility ---
export function getDocumentStatusDisplay(status: DocumentStatus) {
  const map: Record<string, { label: string; className: string }> = {
    PENDING: { label: 'Pending Review', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    APPROVED: { label: 'Approved', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    REJECTED: { label: 'Rejected', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    EXPIRED: { label: 'Expired', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  };
  return map[status] ?? { label: status, className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
}
