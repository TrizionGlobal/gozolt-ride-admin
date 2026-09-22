export type QuickServiceBookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'TO_ASSIGN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type QuickServicePaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

export interface QuickServiceBooking {
  id: string;
  bookingReference: string;

  user: {
    id: string;
    name: string;
    email: string;
    mobile: string;
  };

  categoryId: string;
  categoryName: string;
  childService: string | null;

  description: string | null;
  requirements: Record<string, unknown> | null;
  attachments: string[];
  serviceAddress: string;
  scheduledAt: string;

  supplier: {
    id: string;
    companyName: string;
  } | null;

  professional: {
    id: string;
    name: string;
    mobile: string;
  } | null;

  status: QuickServiceBookingStatus;
  paymentStatus: QuickServicePaymentStatus;

  createdAt: string;
}

export interface QuickServiceBookingFilters {
  search?: string;
  categoryId?: string;
  childService?: string;
  status?: QuickServiceBookingStatus | '';
  page?: number;
  limit?: number;
}

export interface QuickServiceBookingResponse {
  data: QuickServiceBooking[];

  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type SupplierEligibilityType =
  | 'SUBSCRIPTION'
  | 'PAY_AS_YOU_GO';

export interface EligibleQuickServiceSupplier {
  id: string;
  supplierCode: string;
  companyName: string;

  ownerName: string;
  email: string;
  mobile: string;

  businessAddress: string;
  city: string;
  serviceAreas: string[];

  selectedCategoryIds: string[];
  selectedChildServices: string[];

  approvalStatus:
    | 'PENDING'
    | 'ACTIVE'
    | 'SUSPENDED'
    | 'REJECTED';

  availabilityStatus:
    | 'AVAILABLE'
    | 'BUSY'
    | 'OFFLINE';

  eligibilityType: SupplierEligibilityType;

  subscription: {
    planName: string;
    status:
      | 'ACTIVE'
      | 'EXPIRED'
      | 'CANCELLED'
      | 'NOT_REQUIRED';
    startDate: string | null;
    expiryDate: string | null;
  } | null;

  activeJobs: number;
}

export interface EligibleSupplierResponse {
  bookingId: string;
  categoryId: string;
  childService: string | null;
  suppliers: EligibleQuickServiceSupplier[];
}

export interface AssignQuickServiceSupplierPayload {
  supplierId: string;
}

export interface AssignQuickServiceSupplierResponse {
  success: boolean;
  message: string;
  booking: QuickServiceBooking;
}