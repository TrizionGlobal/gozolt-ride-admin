'use client';

import { useState, useEffect, useMemo } from 'react';
import { FileText, Plane, Clock, User, Building2, Search, MapPin, X, Car, CheckCircle, Shield, AlertCircle, Eye } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { formatDateTime } from '@/lib/utils';

interface AdminBooking {
  id: string;
  bookingReference: string;
  flightNumber?: string;
  returnFlightNumber?: string;
  transferType: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  returnDateTime?: string;
  adults?: number;
  children?: number;
  infants?: number;
  standardLuggage?: number;
  largeLuggage?: number;
  leadPassengerName: string;
  leadPassengerEmail?: string;
  leadPassengerPhone: string;
  specialRequests?: string;
  basePrice?: number;
  extrasFee?: number;
  discountAmount?: number;
  grandTotal: number;
  currency: string;
  paymentMethod?: string;
  paymentStatus?: string;
  status: string;
  returnStatus?: string;
  supplier?: { companyName: string; email?: string; phone?: string };
  vehicle?: { make: string; model: string; registrationNo?: string; vehicleType?: string };
  driver?: { firstName: string; lastName: string; phone?: string };
  createdAt?: string;
}

const TABS = [
  { id: 'all', label: 'All Transfers' },
  { id: 'confirmed', label: 'Confirmed & En Route' },
  { id: 'in_transit', label: 'In Transit' },
  { id: 'completed', label: 'Completed' },
  { id: 'pending', label: 'Pending Requests' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function AdminAirportTransferBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/airport-transfers/admin/bookings');
      setBookings(res.data.items || []);
    } catch (err) {
      console.error('Failed to fetch admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      // Tab filter
      if (activeTab === 'confirmed') {
        if (!['CONFIRMED', 'DRIVER_ASSIGNED', 'EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_AIRPORT'].includes(b.status)) return false;
      } else if (activeTab === 'in_transit') {
        if (!['PASSENGER_MET', 'IN_TRANSIT'].includes(b.status)) return false;
      } else if (activeTab === 'completed') {
        if (b.status !== 'COMPLETED') return false;
      } else if (activeTab === 'pending') {
        if (!['PENDING_APPROVAL', 'PENDING_PAYMENT'].includes(b.status)) return false;
      } else if (activeTab === 'cancelled') {
        if (!['CANCELLED', 'REFUNDED'].includes(b.status)) return false;
      }

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          b.bookingReference.toLowerCase().includes(q) ||
          (b.flightNumber && b.flightNumber.toLowerCase().includes(q)) ||
          b.leadPassengerName.toLowerCase().includes(q) ||
          (b.supplier?.companyName && b.supplier.companyName.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [bookings, activeTab, search]);

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
            Audit all airport transport reservations, driver dispatches, and journey completions platform-wide.
          </p>
        </div>

        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reference, flight, passenger..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#141414] border border-[#2A2A2A] text-white text-sm outline-none focus:border-[#FCD223]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-[#2A2A2A] pb-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${activeTab === tab.id
                ? 'bg-[#FCD223] text-black'
                : 'bg-[#141414] text-gray-400 hover:text-white border border-[#2A2A2A]'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FCD223] border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-12 text-center text-gray-400 text-sm">
          No airport transfer bookings found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#2A2A2A] bg-[#141414]">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="border-b border-[#2A2A2A] bg-[#1A1A1A] text-xs uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4">Booking Ref</th>
                <th className="px-6 py-4">Schedule & Route</th>
                <th className="px-6 py-4">Passenger</th>
                <th className="px-6 py-4">Supplier & Driver</th>
                <th className="px-6 py-4">Tariff</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-[#1A1A1A]/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-mono font-bold text-white text-xs text-[#FCD223]">{b.bookingReference}</p>
                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${b.transferType === 'ROUND_TRIP' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                        {b.transferType === 'ROUND_TRIP' ? 'ROUND TRIP' : 'ONE WAY'}
                      </span>
                      {b.flightNumber && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400">
                          <Plane className="h-3 w-3" /> {b.flightNumber}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white text-xs font-semibold flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      {formatDateTime(b.pickupDateTime)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1 truncate max-w-xs">
                      {b.pickupLocation} → {b.dropoffLocation}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-white flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      {b.leadPassengerName}
                    </p>
                    <p className="text-xs text-gray-500">{b.leadPassengerPhone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-white flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-gray-400" />
                      {b.supplier?.companyName || 'Independent'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {b.driver ? `Driver: ${b.driver.firstName} ${b.driver.lastName}` : 'Driver: Unassigned'}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#FCD223]">
                    {b.currency || 'EUR'} {Number(b.grandTotal || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {b.transferType === 'ROUND_TRIP' ? (
                      <div className="flex flex-col gap-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          🛫 Out: {b.status.replace(/_/g, ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          🛬 Ret: {(b.returnStatus || b.status).replace(/_/g, ' ')}
                        </span>
                      </div>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#2A2A2A] text-gray-300">
                        {b.status.replace(/_/g, ' ')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="px-3 py-1.5 rounded-lg bg-[#27272A] text-white hover:bg-[#3F3F46] text-xs font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-[#27272A] bg-[#141414] p-6 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-[#27272A] pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-bold text-[#FCD223] bg-[#FCD223]/10 px-2.5 py-1 rounded-md">
                    {selectedBooking.bookingReference}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-md font-semibold bg-emerald-500/15 text-emerald-400">
                    {selectedBooking.transferType}
                  </span>
                  {selectedBooking.flightNumber && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Plane className="h-3 w-3" /> Flight {selectedBooking.flightNumber}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Created At: {formatDateTime(selectedBooking.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-1 text-gray-400 hover:text-white hover:bg-[#27272A] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 py-4 text-sm max-h-[65vh] overflow-y-auto pr-1 text-gray-300">
              {/* Status Badges */}
              <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-gray-400 font-semibold uppercase">Booking Status</span>
                {selectedBooking.transferType === 'ROUND_TRIP' ? (
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25">
                      🛫 Outbound: {selectedBooking.status.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/25">
                      🛬 Return: {(selectedBooking.returnStatus || selectedBooking.status).replace(/_/g, ' ')}
                    </span>
                  </div>
                ) : (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#2A2A2A] text-white">
                    {selectedBooking.status.replace(/_/g, ' ')}
                  </span>
                )}
              </div>

              {/* Route */}
              <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A] space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-[#FCD223] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <span>🛫</span> Outbound Journey
                    </p>
                    {selectedBooking.flightNumber && (
                      <span className="text-[11px] font-semibold text-blue-400">
                        Flight: {selectedBooking.flightNumber}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5 pl-2 border-l-2 border-emerald-500/40">
                    <div>
                      <span className="text-[11px] text-emerald-400 font-semibold block">Pickup:</span>
                      <p className="text-white text-xs">{selectedBooking.pickupLocation}</p>
                      <p className="text-[11px] text-gray-400">{formatDateTime(selectedBooking.pickupDateTime)}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-red-400 font-semibold block">Drop-off:</span>
                      <p className="text-white text-xs">{selectedBooking.dropoffLocation}</p>
                    </div>
                  </div>
                </div>

                {selectedBooking.transferType === 'ROUND_TRIP' && (
                  <div className="pt-3 border-t border-[#2A2A2A]">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs text-[#FCD223] uppercase font-bold tracking-wider flex items-center gap-1.5">
                        <span>🛬</span> Return Journey
                      </p>
                      {selectedBooking.returnFlightNumber && (
                        <span className="text-[11px] font-semibold text-purple-400">
                          Flight: {selectedBooking.returnFlightNumber}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 pl-2 border-l-2 border-purple-500/40">
                      <div>
                        <span className="text-[11px] text-purple-400 font-semibold block">Pickup:</span>
                        <p className="text-white text-xs">{selectedBooking.dropoffLocation}</p>
                        <p className="text-[11px] text-gray-400">
                          {selectedBooking.returnDateTime ? formatDateTime(selectedBooking.returnDateTime) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[11px] text-red-400 font-semibold block">Drop-off:</span>
                        <p className="text-white text-xs">{selectedBooking.pickupLocation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Passenger & Supplier */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A]">
                  <p className="text-xs text-[#FCD223] uppercase font-bold tracking-wider mb-2">Passenger Info</p>
                  <p className="text-white font-medium">{selectedBooking.leadPassengerName}</p>
                  <p className="text-xs text-gray-400 mt-1">{selectedBooking.leadPassengerPhone}</p>
                  {selectedBooking.leadPassengerEmail && (
                    <p className="text-xs text-gray-500 mt-0.5">{selectedBooking.leadPassengerEmail}</p>
                  )}
                  <div className="mt-2 text-xs text-gray-400">
                    {selectedBooking.adults || 1} Adults · {selectedBooking.children || 0} Children · {(selectedBooking.standardLuggage || 0) + (selectedBooking.largeLuggage || 0)} Bags
                  </div>
                </div>

                <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A]">
                  <p className="text-xs text-[#FCD223] uppercase font-bold tracking-wider mb-2">Supplier & Fleet</p>
                  <p className="text-white font-medium">{selectedBooking.supplier?.companyName || 'Independent'}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Vehicle: {selectedBooking.vehicle?.make} {selectedBooking.vehicle?.model}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Driver: {selectedBooking.driver ? `${selectedBooking.driver.firstName} ${selectedBooking.driver.lastName}` : 'Unassigned'}
                  </p>
                </div>
              </div>

              {/* Tariff */}
              <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A] flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Payment Status</p>
                  <p className="text-white font-bold text-sm mt-0.5">
                    {selectedBooking.paymentStatus || 'PENDING'} ({selectedBooking.paymentMethod || 'CARD'})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Total Fare</p>
                  <p className="text-xl font-bold text-[#FCD223]">
                    {selectedBooking.currency || 'EUR'} {Number(selectedBooking.grandTotal || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#27272A] pt-4 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-lg bg-[#27272A] text-white hover:bg-[#3F3F46] text-xs font-semibold"
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

