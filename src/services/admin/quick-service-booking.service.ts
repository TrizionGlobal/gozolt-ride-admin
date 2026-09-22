import { apiClient } from '@/lib/api-client';

import type {
  AssignQuickServiceSupplierPayload,
  AssignQuickServiceSupplierResponse,
  EligibleSupplierResponse,
  QuickServiceBooking,
  QuickServiceBookingFilters,
  QuickServiceBookingResponse,
  QuickServiceBookingStatus,
} from './quick-service-booking.types';

export const quickServiceBookingService = {
  /**
   * Load Quick Services bookings.
   */
  async getBookings(
    filters: QuickServiceBookingFilters,
  ): Promise<QuickServiceBookingResponse> {
    const { data } =
      await apiClient.get<QuickServiceBookingResponse>(
        '/admin/quick-services/bookings',
        {
          params: filters,
        },
      );

    return data;
  },

  /**
   * Load the complete details of one booking.
   * Used by the View Details and Assign Supplier windows.
   */
  async getBooking(
    bookingId: string,
  ): Promise<QuickServiceBooking> {
    const { data } =
      await apiClient.get<QuickServiceBooking>(
        `/admin/quick-services/bookings/${bookingId}`,
      );

    return data;
  },

  /**
   * Update a booking's operational status.
   */
  async updateStatus(
    bookingId: string,
    status: QuickServiceBookingStatus,
  ): Promise<QuickServiceBooking> {
    const { data } =
      await apiClient.patch<QuickServiceBooking>(
        `/admin/quick-services/bookings/${bookingId}/status`,
        {
          status,
        },
      );

    return data;
  },

  async getEligibleSuppliers(
    bookingId: string,
  ): Promise<EligibleSupplierResponse> {
    const { data } =
      await apiClient.get<EligibleSupplierResponse>(
        `/admin/quick-services/bookings/${bookingId}/eligible-suppliers`,
      );

    return data;
  },

  /**
   * Assign the admin-selected supplier to the booking.
   */
  async assignSupplier(
    bookingId: string,
    supplierId: string,
  ): Promise<AssignQuickServiceSupplierResponse> {
    const payload: AssignQuickServiceSupplierPayload = {
      supplierId,
    };

    const { data } =
      await apiClient.post<AssignQuickServiceSupplierResponse>(
        `/admin/quick-services/bookings/${bookingId}/assign-supplier`,
        payload,
      );

    return data;
  },
};