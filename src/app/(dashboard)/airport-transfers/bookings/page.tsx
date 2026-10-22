'use client';

import { useState, useEffect } from 'react';
import { FileText, Plane, Clock, User, Building2, Search, MapPin } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface AdminBooking {
  id: string;
  bookingReference: string;
  flightNumber?: string;
  transferType: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  leadPassengerName: string;
  leadPassengerPhone: string;
  grandTotal: number;
  currency: string;
  status: string;
  supplier?: { companyName: string };
  vehicle?: { make: string; model: string };
  driver?: { firstName: string; lastName: string; phone: string };
}

export default function AdminAirportTransferBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filtered = bookings.filter(
    (b) =>
      b.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
      (b.flightNumber && b.flightNumber.toLowerCase().includes(search.toLowerCase())) ||
      b.leadPassengerName.toLowerCase().includes(search.toLowerCase()) ||
      b.supplier?.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#FCD223]" />
            Airport Transfer Booking Oversight
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Audit all airport transport reservations, chauffeur dispatches, and journey completions platform-wide.
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
                <th className="px-6 py-4">Supplier & Chauffeur</th>
                <th className="px-6 py-4">Tariff</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-[#1A1A1A]/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-mono font-bold text-white text-xs text-[#FCD223]">{b.bookingReference}</p>
                    {b.flightNumber && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 mt-1">
                        <Plane className="h-3 w-3" /> Flight {b.flightNumber}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white text-xs font-semibold flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      {new Date(b.pickupDateTime).toLocaleString()}
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
                      {b.driver ? `Driver: ${b.driver.firstName}` : 'Unassigned'}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#FCD223]">
                    {b.currency} {Number(b.grandTotal).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#2A2A2A] text-gray-300">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
