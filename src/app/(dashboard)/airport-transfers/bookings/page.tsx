'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Plane,
  Clock,
  User,
  Building2,
  Search,
  MapPin,
  X,
  Car,
  CheckCircle,
  Shield,
  AlertCircle,
  Eye,
  Key,
  Users,
  Briefcase,
  CreditCard,
  RefreshCw,
  ArrowRight,
  Info,
} from 'lucide-react';
import { ServerSideTable, type ColumnDef } from '@/components/ui/server-side-table';
import { useDebounce } from '@/hooks/use-debounce';
import { apiClient } from '@/lib/api-client';
import { formatDateTime, formatStatusLabel } from '@/lib/utils';

export interface AdminBooking {
  id: string;
  bookingReference: string;
  userId?: string;
  supplierId?: string;
  vehicleId?: string;
  driverId?: string | null;
  transferType: string;
  flightNumber?: string | null;
  returnFlightNumber?: string | null;
  pickupLocation: string;
  dropoffLocation: string;
  pickupLat?: number | null;
  pickupLng?: number | null;
  dropoffLat?: number | null;
  dropoffLng?: number | null;
  distanceKm?: number | null;
  durationMinutes?: number | null;
  pickupDateTime: string;
  returnDateTime?: string | null;
  adults?: number;
  children?: number;
  infants?: number;
  standardLuggage?: number;
  largeLuggage?: number;
  leadPassengerName: string;
  leadPassengerEmail?: string;
  leadPassengerPhone: string;
  specialRequests?: string | null;
  basePrice?: number | string;
  extrasFee?: number | string;
  discountAmount?: number | string;
  grandTotal: number | string;
  currency: string;
  paymentMethod?: string;
  paymentStatus?: string;
  stripePaymentIntentId?: string | null;
  status: string;
  returnStatus?: string | null;
  verificationPin?: string | null;
  returnVerificationPin?: string | null;
  cancellationReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
  supplier?: {
    id: string;
    companyName: string;
    email?: string;
    phone?: string;
  } | null;
  vehicle?: {
    id: string;
    make: string;
    model: string;
    registrationNo?: string;
    vehicleType?: string;
    passengerCapacity?: number;
    luggageCapacity?: number;
    photoUrls?: string[];
  } | null;
  driver?: {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string;
  } | null;
  user?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  } | null;
}

const HISTORY_TABS = [
  { id: 'all', label: 'All History', historyFilter: 'ALL' },
  { id: 'completed', label: 'Completed', historyFilter: 'COMPLETED' },
  { id: 'cancelled', label: 'Cancelled & Refunded', historyFilter: 'CANCELLED' },
] as const;

function getStatusStyle(status?: string | null): string {
  if (!status) return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'CANCELLED':
    case 'REFUNDED':
      return 'bg-red-500/15 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/15 text-gray-300 border-gray-500/30';
  }
}

export default function AdminAirportTransferBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

  const debouncedSearch = useDebounce(search, 350);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const currentTab = HISTORY_TABS.find((t) => t.id === activeTab) || HISTORY_TABS[0];
      const params: Record<string, any> = {
        page,
        limit,
        historyFilter: currentTab.historyFilter,
        sortBy: 'pickupDateTime',
        order: 'desc',
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      const res = await apiClient.get('/airport-transfers/admin/bookings', { params });
      setBookings(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch admin airport transfer bookings history:', err);
      setBookings([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, activeTab, debouncedSearch]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Reset page when tab or search changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const columns: ColumnDef<AdminBooking>[] = [
    {
      key: 'bookingOption',
      title: 'BOOKING OPTION',
      className: 'w-[155px] min-w-[145px]',
      render: (row) => (
        <div className="flex flex-col gap-1 py-0.5">
          <span className="font-mono font-bold text-xs text-[#FCD223] tracking-wide">
            {row.bookingReference}
          </span>
          <div>
            <span
              className={`inline-block text-[10px] px-2 py-0.5 rounded font-semibold border ${row.transferType === 'ROUND_TRIP'
                  ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                }`}
            >
              {row.transferType === 'ROUND_TRIP' ? 'ROUND TRIP' : 'ONE WAY'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'scheduleRoute',
      title: 'SCHEDULE & ROUTE',
      className: 'min-w-[210px] max-w-[280px]',
      render: (row) => (
        <div className="space-y-1 py-0.5">
          <div className="text-white text-xs font-semibold flex items-center gap-1.5 flex-wrap">
            <Clock className="h-3.5 w-3.5 text-[#FCD223] shrink-0" />
            <span>{formatDateTime(row.pickupDateTime)}</span>
            {row.flightNumber && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                <Plane className="h-3 w-3 shrink-0" /> {row.flightNumber}
              </span>
            )}
          </div>
          <div className="text-[12px] text-gray-300 leading-snug">
            <span className="text-gray-400">{row.pickupLocation}</span>
            <span className="text-[#FCD223] mx-1 font-bold">→</span>
            <span className="text-gray-200">{row.dropoffLocation}</span>
          </div>
          {row.transferType === 'ROUND_TRIP' && row.returnDateTime && (
            <div className="text-[11px] text-purple-300/90 flex items-center gap-1.5 pt-0.5 flex-wrap">
              <span className="text-[10px] font-medium text-gray-400">Return:</span>
              <span>{formatDateTime(row.returnDateTime)}</span>
              {row.returnFlightNumber && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                  <Plane className="h-2.5 w-2.5 shrink-0" /> {row.returnFlightNumber}
                </span>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'passenger',
      title: 'PASSENGER',
      className: 'w-[150px] min-w-[140px]',
      render: (row) => {
        const totalPax = (row.adults || 1) + (row.children || 0) + (row.infants || 0);
        const totalBags = (row.standardLuggage || 0) + (row.largeLuggage || 0);
        return (
          <div className="space-y-1 py-0.5">
            <div className="font-semibold text-white text-xs flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <span>{row.leadPassengerName}</span>
            </div>
            <div className="text-xs text-gray-400 font-mono">{row.leadPassengerPhone}</div>
            <div className="text-[11px] text-gray-500">
              {totalPax} {totalPax === 1 ? 'Pax' : 'Pax'} · {totalBags} {totalBags === 1 ? 'Bag' : 'Bags'}
            </div>
          </div>
        );
      },
    },
    {
      key: 'supplierDriver',
      title: 'SUPPLIER & DRIVER',
      className: 'w-[160px] min-w-[150px]',
      render: (row) => (
        <div className="space-y-1 py-0.5">
          <div className="font-semibold text-white text-xs flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{row.supplier?.companyName || 'Independent'}</span>
          </div>
          <div className="text-xs text-gray-400">
            Driver:{' '}
            {row.driver ? (
              <span className="text-gray-200 font-medium">
                {row.driver.firstName} {row.driver.lastName}
              </span>
            ) : (
              <span className="text-gray-500 italic">Unassigned</span>
            )}
          </div>
          {row.vehicle && (
            <div className="text-[10px] text-gray-400 font-mono bg-[#1E1E1E] px-1.5 py-0.5 rounded border border-[#2E2E2E] inline-block">
              {row.vehicle.make} {row.vehicle.model}
              {row.vehicle.registrationNo ? ` (${row.vehicle.registrationNo})` : ''}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'fare',
      title: 'TOTAL FARE',
      className: 'w-[110px] min-w-[100px]',
      render: (row) => (
        <div className="space-y-1 py-0.5">
          <div className="font-bold text-[#FCD223] text-sm leading-tight">
            {row.currency || 'EUR'} {Number(row.grandTotal || 0).toFixed(2)}
          </div>
          <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            <span className={row.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-gray-400'}>
              {row.paymentStatus || 'PAID'}
            </span>
            <span className="text-gray-600 mx-1">•</span>
            <span>{row.paymentMethod || 'CARD'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'STATUS',
      className: 'w-[130px] min-w-[120px]',
      render: (row) => {
        if (row.transferType === 'ROUND_TRIP') {
          return (
            <div className="flex flex-col gap-1 py-0.5">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getStatusStyle(
                  row.status
                )} inline-flex items-center gap-1 whitespace-nowrap`}
              >
                🛫 Out: {formatStatusLabel(row.status)}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getStatusStyle(
                  row.returnStatus || row.status
                )} inline-flex items-center gap-1 whitespace-nowrap`}
              >
                🛬 Ret: {formatStatusLabel(row.returnStatus || row.status)}
              </span>
            </div>
          );
        }
        return (
          <div className="py-0.5">
            <span
              className={`inline-block px-3 py-1 rounded-md text-xs font-semibold border ${getStatusStyle(
                row.status
              )} whitespace-nowrap`}
            >
              {formatStatusLabel(row.status)}
            </span>
          </div>
        );
      },
    },
    {
      key: 'action',
      title: 'ACTION',
      className: 'text-center w-[100px] min-w-[90px]',
      render: (row) => (
        <div className="flex justify-center py-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBooking(row);
            }}
            className="px-3 py-1.5 rounded-lg bg-[#222222] text-white hover:bg-[#2E2E2E] hover:text-[#FCD223] text-xs font-medium inline-flex items-center gap-1.5 transition-colors border border-[#333333]"
          >
            <Eye className="h-3.5 w-3.5 text-[#FCD223]" /> Details
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#FCD223]" />
            Airport Transfer Booking Oversight
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Audit completed and cancelled airport transfer reservations, trip histories, and driver completions platform-wide.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchBookings()}
            disabled={loading}
            className="h-10 px-3.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-gray-400 hover:text-white hover:border-[#FCD223]/50 transition-colors flex items-center gap-2 text-xs font-medium"
            title="Refresh bookings"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#FCD223]' : ''}`} />
            Refresh
          </button>

          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reference, flight, passenger..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#141414] border border-[#2A2A2A] text-white text-sm outline-none focus:border-[#FCD223] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs for Completed & Cancelled History */}
      <div className="flex gap-2 overflow-x-auto border-b border-[#2A2A2A] pb-3">
        {HISTORY_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${isActive
                  ? 'bg-[#FCD223] text-black shadow-sm'
                  : 'bg-[#141414] text-gray-400 hover:text-white border border-[#2A2A2A]'
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ServerSideTable */}
      <div className="rounded-xl border border-[#27272A] bg-[#141414] overflow-hidden">
        <ServerSideTable<AdminBooking>
          columns={columns}
          data={bookings}
          isLoading={loading}
          page={page}
          limit={limit}
          total={total}
          onPageChange={(p) => setPage(p)}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
          rowKey="id"
          emptyText="No completed or cancelled airport transfer history found."
        />
      </div>

      {/* Dynamic Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl border border-[#27272A] bg-[#121212] p-6 shadow-2xl my-8 text-gray-300">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#27272A] pb-4">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-sm font-bold text-[#FCD223] bg-[#FCD223]/10 px-3 py-1 rounded-lg border border-[#FCD223]/20">
                    {selectedBooking.bookingReference}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold border ${selectedBooking.transferType === 'ROUND_TRIP'
                        ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}
                  >
                    {selectedBooking.transferType === 'ROUND_TRIP' ? 'ROUND TRIP' : 'ONE WAY'}
                  </span>
                  {selectedBooking.flightNumber && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Plane className="h-3.5 w-3.5" /> Outbound Flight {selectedBooking.flightNumber}
                    </span>
                  )}
                  {selectedBooking.returnFlightNumber && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Plane className="h-3.5 w-3.5" /> Return Flight {selectedBooking.returnFlightNumber}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-3">
                  <span>Created: {formatDateTime(selectedBooking.createdAt)}</span>
                  <span>•</span>
                  <span>Updated: {formatDateTime(selectedBooking.updatedAt)}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-[#27272A] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 py-4 text-sm max-h-[70vh] overflow-y-auto pr-1">
              {/* Status & PIN Banner */}
              <div className="bg-[#181818] p-4 rounded-xl border border-[#2A2A2A] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-gray-400 font-semibold uppercase block mb-1">
                    Booking Status
                  </span>
                  {selectedBooking.transferType === 'ROUND_TRIP' ? (
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusStyle(
                          selectedBooking.status
                        )}`}
                      >
                        🛫 Out: {formatStatusLabel(selectedBooking.status)}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusStyle(
                          selectedBooking.returnStatus || selectedBooking.status
                        )}`}
                      >
                        🛬 Ret: {formatStatusLabel(selectedBooking.returnStatus || selectedBooking.status)}
                      </span>
                    </div>
                  ) : (
                    <span
                      className={`inline-block px-3 py-1 rounded-md text-xs font-semibold border ${getStatusStyle(
                        selectedBooking.status
                      )}`}
                    >
                      {formatStatusLabel(selectedBooking.status)}
                    </span>
                  )}
                </div>

                {/* Verification PINs */}
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedBooking.verificationPin && (
                    <div className="flex items-center gap-2 bg-[#222] px-3 py-1.5 rounded-lg border border-[#333]">
                      <Key className="h-3.5 w-3.5 text-[#FCD223]" />
                      <span className="text-xs text-gray-400">Ride PIN:</span>
                      <span className="font-mono font-bold text-sm text-[#FCD223] tracking-wider">
                        {selectedBooking.verificationPin}
                      </span>
                    </div>
                  )}
                  {selectedBooking.returnVerificationPin && (
                    <div className="flex items-center gap-2 bg-[#222] px-3 py-1.5 rounded-lg border border-[#333]">
                      <Key className="h-3.5 w-3.5 text-purple-400" />
                      <span className="text-xs text-gray-400">Return PIN:</span>
                      <span className="font-mono font-bold text-sm text-purple-400 tracking-wider">
                        {selectedBooking.returnVerificationPin}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Journey Itinerary Card */}
              <div className="bg-[#181818] p-4 rounded-xl border border-[#2A2A2A] space-y-4">
                {/* Outbound */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-[#FCD223] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <span>🛫</span> Outbound Journey
                    </p>
                    <div className="flex items-center gap-2">
                      {selectedBooking.flightNumber && (
                        <span className="text-xs font-semibold text-blue-400">
                          Flight: {selectedBooking.flightNumber}
                        </span>
                      )}
                      {selectedBooking.distanceKm ? (
                        <span className="text-[11px] text-gray-400 bg-[#222] px-2 py-0.5 rounded">
                          {selectedBooking.distanceKm} km
                        </span>
                      ) : null}
                      {selectedBooking.durationMinutes ? (
                        <span className="text-[11px] text-gray-400 bg-[#222] px-2 py-0.5 rounded">
                          ~{selectedBooking.durationMinutes} mins
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2.5 pl-3 border-l-2 border-emerald-500/50">
                    <div>
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Pickup Location:
                      </span>
                      <p className="text-white text-xs mt-0.5 font-medium">{selectedBooking.pickupLocation}</p>
                      <p className="text-[11px] text-[#FCD223] mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatDateTime(selectedBooking.pickupDateTime)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-red-400 font-semibold flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Drop-off Location:
                      </span>
                      <p className="text-white text-xs mt-0.5 font-medium">{selectedBooking.dropoffLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Return (if Round Trip) */}
                {selectedBooking.transferType === 'ROUND_TRIP' && (
                  <div className="pt-3 border-t border-[#2A2A2A]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-purple-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                        <span>🛬</span> Return Journey
                      </p>
                      {selectedBooking.returnFlightNumber && (
                        <span className="text-xs font-semibold text-purple-400">
                          Flight: {selectedBooking.returnFlightNumber}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2.5 pl-3 border-l-2 border-purple-500/50">
                      <div>
                        <span className="text-[11px] text-purple-400 font-semibold flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Pickup Location:
                        </span>
                        <p className="text-white text-xs mt-0.5 font-medium">{selectedBooking.dropoffLocation}</p>
                        <p className="text-[11px] text-purple-400 mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" />{' '}
                          {selectedBooking.returnDateTime
                            ? formatDateTime(selectedBooking.returnDateTime)
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[11px] text-red-400 font-semibold flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Drop-off Location:
                        </span>
                        <p className="text-white text-xs mt-0.5 font-medium">{selectedBooking.pickupLocation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Passenger & Supplier Grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Passenger Info */}
                <div className="bg-[#181818] p-4 rounded-xl border border-[#2A2A2A]">
                  <p className="text-xs text-[#FCD223] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> Passenger Details
                  </p>
                  <p className="text-white font-medium text-sm">{selectedBooking.leadPassengerName}</p>
                  <p className="text-xs text-gray-400 mt-1 font-mono">{selectedBooking.leadPassengerPhone}</p>
                  {selectedBooking.leadPassengerEmail && (
                    <p className="text-xs text-gray-400 mt-0.5">{selectedBooking.leadPassengerEmail}</p>
                  )}
                  {selectedBooking.user && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      Account: {selectedBooking.user.firstName} {selectedBooking.user.lastName} ({selectedBooking.user.email})
                    </p>
                  )}

                  <div className="mt-3 pt-3 border-t border-[#2A2A2A] grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 block text-[11px]">Party:</span>
                      <span className="text-white font-medium">
                        {selectedBooking.adults || 1} Adults · {selectedBooking.children || 0} Children
                        {selectedBooking.infants ? ` · ${selectedBooking.infants} Infants` : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[11px]">Luggage:</span>
                      <span className="text-white font-medium">
                        {selectedBooking.standardLuggage || 0} Std · {selectedBooking.largeLuggage || 0} Large
                      </span>
                    </div>
                  </div>

                  {selectedBooking.specialRequests && (
                    <div className="mt-3 pt-2 border-t border-[#2A2A2A] text-xs">
                      <span className="text-[#FCD223] font-semibold block text-[11px]">Special Requests:</span>
                      <p className="text-gray-300 italic mt-0.5">{selectedBooking.specialRequests}</p>
                    </div>
                  )}

                  {selectedBooking.cancellationReason && (
                    <div className="mt-3 pt-2 border-t border-red-500/20 text-xs text-red-400">
                      <span className="font-semibold block text-[11px]">Cancellation Reason:</span>
                      <p className="italic mt-0.5">{selectedBooking.cancellationReason}</p>
                    </div>
                  )}
                </div>

                {/* Fleet & Driver Info */}
                <div className="bg-[#181818] p-4 rounded-xl border border-[#2A2A2A]">
                  <p className="text-xs text-[#FCD223] uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
                    <Car className="h-3.5 w-3.5" /> Supplier & Fleet
                  </p>
                  <p className="text-white font-medium text-sm">
                    {selectedBooking.supplier?.companyName || 'Independent Supplier'}
                  </p>
                  {selectedBooking.supplier?.phone && (
                    <p className="text-xs text-gray-400 mt-0.5">{selectedBooking.supplier.phone}</p>
                  )}

                  <div className="mt-3 pt-3 border-t border-[#2A2A2A] space-y-1.5 text-xs">
                    <div>
                      <span className="text-gray-500 text-[11px] block">Vehicle:</span>
                      <p className="text-white font-medium">
                        {selectedBooking.vehicle
                          ? `${selectedBooking.vehicle.make} ${selectedBooking.vehicle.model}`
                          : 'Not assigned'}
                        {selectedBooking.vehicle?.registrationNo
                          ? ` • Reg: ${selectedBooking.vehicle.registrationNo}`
                          : ''}
                      </p>
                      {selectedBooking.vehicle?.vehicleType && (
                        <span className="text-[10px] text-gray-400">
                          Class: {selectedBooking.vehicle.vehicleType}
                        </span>
                      )}
                    </div>

                    <div className="pt-1.5">
                      <span className="text-gray-500 text-[11px] block">Assigned Driver:</span>
                      {selectedBooking.driver ? (
                        <p className="text-white font-medium">
                          {selectedBooking.driver.firstName} {selectedBooking.driver.lastName}
                          {selectedBooking.driver.phone ? ` (${selectedBooking.driver.phone})` : ''}
                        </p>
                      ) : (
                        <p className="text-yellow-400/80 italic">Unassigned</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tariff & Payment Audit */}
              <div className="bg-[#181818] p-4 rounded-xl border border-[#2A2A2A] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase font-semibold flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-[#FCD223]" /> Payment Details
                  </p>
                  <p className="text-white font-medium text-xs">
                    Status:{' '}
                    <span className="text-emerald-400 font-semibold">
                      {selectedBooking.paymentStatus || 'PAID'}
                    </span>{' '}
                    via {selectedBooking.paymentMethod || 'CARD'}
                  </p>
                  {selectedBooking.stripePaymentIntentId && (
                    <p className="text-[11px] text-gray-500 font-mono">
                      Stripe Ref: {selectedBooking.stripePaymentIntentId}
                    </p>
                  )}
                  {Number(selectedBooking.basePrice || 0) > 0 && (
                    <div className="flex gap-3 text-[11px] text-gray-400 mt-1">
                      <span>Base: {selectedBooking.currency || 'EUR'} {Number(selectedBooking.basePrice).toFixed(2)}</span>
                      {Number(selectedBooking.extrasFee || 0) > 0 && (
                        <span>Extras: +{Number(selectedBooking.extrasFee).toFixed(2)}</span>
                      )}
                      {Number(selectedBooking.discountAmount || 0) > 0 && (
                        <span>Discount: -{Number(selectedBooking.discountAmount).toFixed(2)}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#2A2A2A]">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Total Fare</p>
                  <p className="text-2xl font-bold text-[#FCD223]">
                    {selectedBooking.currency || 'EUR'} {Number(selectedBooking.grandTotal || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#27272A] pt-4 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl bg-[#27272A] text-white hover:bg-[#3F3F46] text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
