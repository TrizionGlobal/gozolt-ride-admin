'use client';

import { useCallback, useEffect, useState } from 'react';

import { quickServiceBookingService } from '@/services/admin/quick-service-booking.service';

import type {
  AssignQuickServiceSupplierResponse,
  EligibleQuickServiceSupplier,
  QuickServiceBooking,
  QuickServiceBookingFilters,
  QuickServiceBookingStatus,
} from '@/services/admin/quick-service-booking.types';

interface UseQuickServiceBookingsResult {
  bookings: QuickServiceBooking[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useQuickServiceBookings(
  filters: QuickServiceBookingFilters = {},
): UseQuickServiceBookingsResult {
  const [bookings, setBookings] = useState<QuickServiceBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response =
        await quickServiceBookingService.getBookings(filters);

      setBookings(response.data ?? []);
      setTotal(response.data?.length ?? 0);
    } catch (requestError) {
      console.error(
        'Unable to load Quick Services bookings:',
        requestError,
      );

      setBookings([]);
      setTotal(0);
      setError(
        'The Booking Management page is ready, but booking information could not be loaded. Confirm the Quick Services booking API with the backend team.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    filters.search,
    filters.categoryId,
    filters.childService,
    filters.status,
    filters.page,
    filters.limit,
  ]);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  return {
    bookings,
    total,
    isLoading,
    error,
    refresh: loadBookings,
  };
}

interface UseQuickServiceBookingResult {
  booking: QuickServiceBooking | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateStatus: (
    status: QuickServiceBookingStatus,
  ) => Promise<QuickServiceBooking>;
}

export function useQuickServiceBooking(
  bookingId: string | null,
): UseQuickServiceBookingResult {
  const [booking, setBooking] =
    useState<QuickServiceBooking | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(bookingId));
  const [error, setError] = useState<string | null>(null);

  const loadBooking = useCallback(async () => {
    if (!bookingId) {
      setBooking(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response =
        await quickServiceBookingService.getBooking(bookingId);

      setBooking(response);
    } catch (requestError) {
      console.error(
        'Unable to load Quick Services booking details:',
        requestError,
      );

      setBooking(null);
      setError('Unable to load the booking details.');
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    void loadBooking();
  }, [loadBooking]);

  const updateStatus = useCallback(
    async (
      status: QuickServiceBookingStatus,
    ): Promise<QuickServiceBooking> => {
      if (!bookingId) {
        throw new Error('A booking ID is required.');
      }

      const updatedBooking =
        await quickServiceBookingService.updateStatus(
          bookingId,
          status,
        );

      setBooking(updatedBooking);
      return updatedBooking;
    },
    [bookingId],
  );

  return {
    booking,
    isLoading,
    error,
    refresh: loadBooking,
    updateStatus,
  };
}

interface UseEligibleQuickServiceSuppliersResult {
  suppliers: EligibleQuickServiceSupplier[];
  selectedSupplier: EligibleQuickServiceSupplier | null;
  isLoading: boolean;
  isAssigning: boolean;
  error: string | null;
  selectSupplier: (
    supplier: EligibleQuickServiceSupplier | null,
  ) => void;
  loadSuppliers: () => Promise<void>;
  assignSelectedSupplier: (
  ) => Promise<AssignQuickServiceSupplierResponse>;
  reset: () => void;
}

export function useEligibleQuickServiceSuppliers(
  bookingId: string | null,
  enabled = false,
): UseEligibleQuickServiceSuppliersResult {
  const [suppliers, setSuppliers] = useState<
    EligibleQuickServiceSupplier[]
  >([]);
  const [selectedSupplier, setSelectedSupplier] =
    useState<EligibleQuickServiceSupplier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSuppliers = useCallback(async () => {
    if (!bookingId) {
      setSuppliers([]);
      setSelectedSupplier(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSelectedSupplier(null);

      const response =
        await quickServiceBookingService.getEligibleSuppliers(
          bookingId,
        );

      setSuppliers(response.suppliers ?? []);
    } catch (requestError) {
      console.error(
        'Unable to load eligible suppliers:',
        requestError,
      );

      setSuppliers([]);
      setSelectedSupplier(null);
      setError(
        'Unable to load eligible suppliers for this booking.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (enabled && bookingId) {
      void loadSuppliers();
    }
  }, [enabled, bookingId, loadSuppliers]);

  const selectSupplier = useCallback(
    (supplier: EligibleQuickServiceSupplier | null) => {
      setSelectedSupplier(supplier);
      setError(null);
    },
    [],
  );

  const assignSelectedSupplier = useCallback(
    async (): Promise<AssignQuickServiceSupplierResponse> => {
      if (!bookingId) {
        throw new Error('A booking ID is required.');
      }

      if (!selectedSupplier) {
        throw new Error('Select a supplier before assigning.');
      }

      try {
        setIsAssigning(true);
        setError(null);

        return await quickServiceBookingService.assignSupplier(
          bookingId,
          selectedSupplier.id,
        );
      } catch (requestError) {
        console.error(
          'Unable to assign supplier:',
          requestError,
        );

        setError(
          'The supplier could not be assigned. Please try again.',
        );

        throw requestError;
      } finally {
        setIsAssigning(false);
      }
    },
    [bookingId, selectedSupplier],
  );

  const reset = useCallback(() => {
    setSuppliers([]);
    setSelectedSupplier(null);
    setError(null);
    setIsLoading(false);
    setIsAssigning(false);
  }, []);

  return {
    suppliers,
    selectedSupplier,
    isLoading,
    isAssigning,
    error,
    selectSupplier,
    loadSuppliers,
    assignSelectedSupplier,
    reset,
  };
}