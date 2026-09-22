'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, ClipboardList, Eye, MapPin, MoreVertical, RefreshCw,Search, UserPlus, X, } from 'lucide-react';
import { getQuickServiceBySlug, } from '@/lib/quick-services';
import { useEligibleQuickServiceSuppliers, useQuickServiceBookings, } from '@/hooks/use-quick-service-bookings';
import type { EligibleQuickServiceSupplier, QuickServiceBookingStatus, QuickServiceBooking, } from '@/services/admin/quick-service-booking.types';

export default function ServiceBookingManagementPage() {
  const params = useParams<{ service: string }>();

  const service = getQuickServiceBySlug(params.service);

  const [search, setSearch] = useState('');
  const [childService, setChildService] = useState('');
  const [status, setStatus] =
    useState<QuickServiceBookingStatus | ''>('');
    
  const [selectedBooking, setSelectedBooking] =
  useState<QuickServiceBooking | null>(null);

const [assignmentBooking, setAssignmentBooking] =
  useState<QuickServiceBooking | null>(null);

const [openActionId, setOpenActionId] =
  useState<string | null>(null);

const [assignmentSuccess, setAssignmentSuccess] =
  useState<string | null>(null);

const showSupplierColumn = status === 'ASSIGNED';
const showAssignAction = status === 'TO_ASSIGN';

const tableColumnCount = showSupplierColumn ? 10 : 9;
  
  const filters = useMemo(
    () => ({
      search: search || undefined,
      categoryId: service?.id,
      childService: childService || undefined,
      status,
      page: 1,
      limit: 20,
    }),
    [
      search,
      service?.id,
      childService,
      status,
    ],
  );

  const {
    bookings,
    total,
    isLoading: loading,
    error,
    refresh,
  } = useQuickServiceBookings( filters,);

  const {
  suppliers,
  selectedSupplier,
  isLoading: suppliersLoading,
  isAssigning,
  error: supplierError,
  selectSupplier,
  assignSelectedSupplier,
  reset: resetSupplierSelection,
} = useEligibleQuickServiceSuppliers(
  assignmentBooking?.id ?? null,
  Boolean(assignmentBooking),
);


const openBookingDetails = (booking: QuickServiceBooking) => {
  setSelectedBooking(booking);
  setOpenActionId(null);
};

const openSupplierAssignment = (
  booking: QuickServiceBooking,
) => {
  setAssignmentSuccess(null);
  setAssignmentBooking(booking);
  setOpenActionId(null);
};

const closeSupplierAssignment = () => {
  setAssignmentBooking(null);
  setAssignmentSuccess(null);
  resetSupplierSelection();
};

const handleAssignSupplier = async () => {
  if (!selectedSupplier) {
    return;
  }

  try {
    await assignSelectedSupplier();

    setAssignmentSuccess(
      `${selectedSupplier.companyName} has been assigned successfully.`,
    );

    await refresh();

    setTimeout(() => {
      closeSupplierAssignment();
    }, 1200);
  } catch {
    // The hook already provides the assignment error.
  }
};

  if (!service) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
        <h1 className="text-xl font-bold text-white">
          Quick Service not found
        </h1>

        <Link
          href="/quick-services/booking-management"
          className="mt-4 inline-flex text-sm font-medium text-[#FCD223]"
        >
          Return to Booking Management
        </Link>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#141414]">
            <Image
              src={service.icon}
              alt={service.name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              {service.name} Booking Management
            </h1>

            <p className="mt-1 text-sm text-[#6B7280]">
              Review bookings, customer requirements, assigned
              professionals, schedules and service progress.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#141414] px-4 py-2 text-sm font-medium text-white hover:bg-[#1A1A1A] disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 text-[#FCD223] ${
              loading ? 'animate-spin' : ''
            }`}
          />

          Refresh
        </button>
      </div>

      <Link
        href="/quick-services/booking-management"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#FCD223] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        All Quick Services
      </Link>

      {/* Filters */}
      <div
        className={`grid grid-cols-1 gap-3 rounded-xl border border-[#2A2A2A] bg-[#141414] p-4 ${
          service.childServices.length > 0
            ? 'md:grid-cols-3'
            : 'md:grid-cols-2'
        }`}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search booking, user or mobile"
            className="h-10 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] pl-10 pr-3 text-sm text-white outline-none focus:border-[#FCD223]"
          />
        </div>

        {service.childServices.length > 0 && (
          <select
            value={childService}
            onChange={(event) =>
              setChildService(event.target.value)
            }
            className="h-10 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#FCD223]"
          >
            <option value="">
              All {service.name} services
            </option>

            {service.childServices.map((child) => (
              <option key={child} value={child}>
                {child}
              </option>
            ))}
          </select>
        )}

        <select
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as
                | QuickServiceBookingStatus
                | '',
            )
          }
          className="h-10 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 text-sm text-white outline-none focus:border-[#FCD223]"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="TO_ASSIGN">To Assign</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          Booking information could not be loaded. Confirm that
          the backend supports accepts categoryId and childService
          filters.
        </div>
      )}

      {/* Booking table */}
      <div className="overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#141414]">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] p-5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {service.name} Bookings
            </h2>

            <p className="mt-1 text-xs text-[#6B7280]">
              {total} bookings found
            </p>
          </div>

          <ClipboardList className="h-5 w-5 text-[#FCD223]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0F0F0F]">
              <tr>
                <TableHeading>Booking</TableHeading>
                <TableHeading>User</TableHeading>
                <TableHeading>Service</TableHeading>
                <TableHeading>Schedule</TableHeading>
                <TableHeading>Location</TableHeading>
                {showSupplierColumn && (
                  <TableHeading>Supplier</TableHeading>
                )}
                <TableHeading>Professional</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading>Payment</TableHeading>
                <TableHeading>Actions</TableHeading>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={tableColumnCount}
                    className="px-4 py-16 text-center text-sm text-[#6B7280]"
                  >
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableColumnCount}
                    className="px-4 py-16 text-center"
                  >
                    <ClipboardList className="mx-auto h-10 w-10 text-[#52525B]" />

                    <p className="mt-3 text-sm font-medium text-white">
                      No bookings found
                    </p>

                    <p className="mt-1 text-xs text-[#6B7280]">
                      {service.name} bookings will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]"
                  >
                    <TableCell>
                      {booking.bookingReference}
                    </TableCell>

                    <TableCell>
                      <p>{booking.user.name}</p>
                      <p className="text-xs text-[#6B7280]">
                        {booking.user.mobile}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p>{booking.categoryName}</p>
                      <p className="text-xs text-[#FCD223]">
                        {booking.childService ?? 'General'}
                      </p>
                    </TableCell>

                    <TableCell>
                      <span className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[#FCD223]" />
                        {new Date(
                          booking.scheduledAt,
                        ).toLocaleString()}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FCD223]" />
                        {booking.serviceAddress}
                      </span>
                    </TableCell>

                    {showSupplierColumn && (
                      <TableCell>
                        {booking.supplier?.companyName ??
                          'Not assigned'}
                      </TableCell>
                    )}

                    <TableCell>
                      {booking.professional?.name ??
                        'Not assigned'}
                    </TableCell>

                    <TableCell>
                      <StatusBadge value={booking.status} />
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        value={booking.paymentStatus}
                      />
                    </TableCell>

                    <TableCell>
                        <div className="relative">
                             <button
                                type="button"
                                onClick={() =>
                                    setOpenActionId((current) =>
                                    current === booking.id ? null : booking.id,
                                     )
                                }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] text-white hover:border-[#FCD223] hover:text-[#FCD223]"
                            aria-label={`Actions for ${booking.bookingReference}`}
                            >
                            <MoreVertical className="h-4 w-4" />
                             </button>

                             {openActionId === booking.id && (
                            <div className="absolute right-0 top-11 z-30 min-w-44 overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#141414] shadow-xl">
                                <button
                                    type="button"
                                    onClick={() => openBookingDetails(booking)}
                                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-white hover:bg-[#202020]"
                             >
                                <Eye className="h-4 w-4 text-[#FCD223]" />
                                View Details
                                </button>

                                 {showAssignAction && (
                                 <button
                                     type="button"
                                    onClick={() => openSupplierAssignment(booking)}
                                    className="flex w-full items-center gap-2 border-t border-[#2A2A2A] px-4 py-3 text-left text-sm text-white hover:bg-[#202020]"
                                    >
                                <UserPlus className="h-4 w-4 text-[#FCD223]" />
                                 Assign Supplier
                                </button>
                                )}
                                 </div>
                                 )}
                             </div>
                            </TableCell>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

{/* Step 11: View Details dialog */}
      {selectedBooking && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#2A2A2A] bg-[#141414] shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#2A2A2A] p-5">
        <div>
          <h2 className="text-xl font-bold text-white">
            Booking Details
          </h2>

          <p className="mt-1 text-sm text-[#6B7280]">
            {selectedBooking.bookingReference}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSelectedBooking(null)}
          className="rounded-lg p-2 text-[#6B7280] hover:bg-[#202020] hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2">
        <DetailItem
          label="Customer"
          value={selectedBooking.user.name}
        />

        <DetailItem
          label="Mobile"
          value={selectedBooking.user.mobile}
        />

        <DetailItem
          label="Service Category"
          value={selectedBooking.categoryName}
        />

        <DetailItem
          label="Selected Service"
          value={selectedBooking.childService ?? 'General'}
        />

        <DetailItem
          label="Schedule"
          value={new Date(
            selectedBooking.scheduledAt,
          ).toLocaleString()}
        />

        <DetailItem
          label="Location"
          value={selectedBooking.serviceAddress}
        />

        <DetailItem
          label="Status"
          value={selectedBooking.status}
        />

        <DetailItem
          label="Payment"
          value={selectedBooking.paymentStatus}
        />

        <DetailItem
          label="Supplier"
          value={
            selectedBooking.supplier?.companyName ??
            'Not assigned'
          }
        />

        <DetailItem
          label="Professional"
          value={
            selectedBooking.professional?.name ??
            'Not assigned'
          }
        />
      </div>
    </div>
  </div>
)}

{/* Step 12: Assign Supplier dialog */}
{assignmentBooking && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
    <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-[#2A2A2A] bg-[#141414] shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#2A2A2A] p-5">
        <div>
          <h2 className="text-xl font-bold text-white">
            Assign Supplier
          </h2>

          <p className="mt-1 text-sm text-[#6B7280]">
            {assignmentBooking.bookingReference} ·{' '}
            {assignmentBooking.categoryName} ·{' '}
            {assignmentBooking.childService ?? 'General'}
          </p>
        </div>

        <button
          type="button"
          onClick={closeSupplierAssignment}
          disabled={isAssigning}
          className="rounded-lg p-2 text-[#6B7280] hover:bg-[#202020] hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-5">
        <div className="mb-5 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
          <p className="text-sm font-semibold text-white">
            Required supplier match
          </p>

          <p className="mt-2 text-sm text-[#6B7280]">
            Only active and approved suppliers providing{' '}
            <span className="text-[#FCD223]">
              {assignmentBooking.childService ??
                assignmentBooking.categoryName}
            </span>{' '}
            in the booking location should appear.
          </p>
        </div>

        {suppliersLoading ? (
          <p className="py-10 text-center text-sm text-[#6B7280]">
            Loading eligible suppliers...
          </p>
        ) : supplierError ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {supplierError}
          </p>
        ) : suppliers.length === 0 ? (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-400">
            No eligible suppliers were found for this booking.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {suppliers.map((supplier) => (
              <SupplierOption
                key={supplier.id}
                supplier={supplier}
                selected={selectedSupplier?.id === supplier.id}
                onSelect={() => selectSupplier(supplier)}
              />
            ))}
          </div>
        )}

        {selectedSupplier && (
          <div className="mt-6 rounded-xl border border-[#FCD223]/40 bg-[#FCD223]/5 p-5">
            <h3 className="text-lg font-semibold text-white">
              Selected Supplier
            </h3>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <DetailItem
                label="Company"
                value={selectedSupplier.companyName}
              />

              <DetailItem
                label="Supplier ID"
                value={selectedSupplier.supplierCode}
              />

              <DetailItem
                label="Subscription"
                value={formatSupplierSubscription( selectedSupplier.subscription,)}
              />

              <DetailItem
                label="Availability"
                value="Available"
              />
            </div>

            <button
              type="button"
              onClick={handleAssignSupplier}
              disabled={isAssigning}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#FCD223] px-5 py-3 text-sm font-semibold text-black hover:bg-[#FFD84D] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4" />

              {isAssigning
                ? 'Assigning...'
                : 'Assign This Supplier'}
            </button>
          </div>
        )}

        {assignmentSuccess && (
          <p className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
            {assignmentSuccess}
          </p>
        )}
      </div>
    </div>
  </div>
)}


    </div>
  );
}


function formatSupplierSubscription(
  subscription: unknown,
): string {
  if (typeof subscription === 'string') {
    return subscription;
  }

  if (
    subscription &&
    typeof subscription === 'object'
  ) {
    const details = subscription as Record<string, unknown>;

    const plan =
      details.planName ??
      details.plan ??
      details.type ??
      details.mode;

    const status =
      details.status ??
      details.subscriptionStatus;

    if (plan && status) {
      return `${String(plan)} - ${String(status)}`;
    }

    if (plan) {
      return String(plan);
    }

    if (status) {
      return String(status);
    }
  }

  return 'Eligible';
}


function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
        {label}
      </p>

      <div className="mt-2 break-words text-sm text-white">
        {value || 'Not available'}
      </div>
    </div>
  );
}

function SupplierOption({
  supplier,
  selected,
  onSelect,
}: {
  supplier: EligibleQuickServiceSupplier;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-xl border p-4 text-left transition-colors ${
        selected
          ? 'border-[#FCD223] bg-[#FCD223]/10'
          : 'border-[#2A2A2A] bg-[#0A0A0A] hover:border-[#FCD223]/50'
      }`}
    >
      <p className="font-semibold text-white">
        {supplier.companyName}
      </p>

      <p className="mt-1 text-xs text-[#6B7280]">
        Supplier ID: {supplier.supplierCode}
      </p>

      <p className="mt-3 text-sm text-[#D1D5DB]">
        Subscription: {' '}
        {formatSupplierSubscription(supplier.subscription)}
      </p>

      <p className="mt-1 text-sm text-[#D1D5DB]">
        Availability: Available
      </p>

      <p className="mt-3 text-xs font-medium text-[#FCD223]">
        {selected ? 'Selected' : 'Select supplier'}
      </p>
    </button>
  );
}

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
      {children}
    </th>
  );
}

function TableCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td className="px-4 py-4 text-sm text-[#D1D5DB]">
      {children}
    </td>
  );
}

function StatusBadge({ value }: { value: string }) {
  const positive = [
    'COMPLETED',
    'PAID',
    'CONFIRMED',
  ].includes(value);

  const active = [
    'PENDING',
    'ASSIGNED',
    'IN_PROGRESS',
  ].includes(value);

  const colour = positive
    ? 'bg-green-500/10 text-green-400'
    : active
      ? 'bg-amber-500/10 text-amber-400'
      : 'bg-red-500/10 text-red-400';

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${colour}`}
    >
      {value.replaceAll('_', ' ')}
    </span>
  );
}