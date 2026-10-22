'use client';

import { useState, useEffect } from 'react';
import { Car, CheckCircle2, XCircle, Search, Building2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface AdminVehicle {
  id: string;
  make: string;
  model: string;
  registrationNo: string;
  vehicleType: string;
  passengerCapacity: number;
  luggageCapacity: number;
  fixedPrice: number;
  currency: string;
  isApproved: boolean;
  supplier: {
    id: string;
    companyName: string;
    contactPhone: string;
    email: string;
  };
}

const CATEGORY_NAMES: Record<string, string> = {
  GO_5P: 'Go - 5P',
  PREMIUM_5P: 'Premium - 5P',
  SUV_7P: 'SUV - 7P',
  MINI_VAN_8P: 'Mini Van - 8P & Above',
  VAN_8P: 'Van - 8P & Above',
  ELECTRIC_5P: 'Electric - 5P',
};

export default function AdminAirportTransferVehiclesPage() {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/airport-transfers/admin/vehicles');
      setVehicles(res.data.items || []);
    } catch (err) {
      console.error('Failed to fetch admin vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const toggleApproval = async (id: string, currentApproved: boolean) => {
    try {
      await apiClient.patch(`/airport-transfers/admin/vehicles/${id}/approval`, {
        isApproved: !currentApproved,
      });
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, isApproved: !currentApproved } : v))
      );
    } catch (err) {
      alert('Failed to update vehicle approval status');
    }
  };

  const filtered = vehicles.filter(
    (v) =>
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.registrationNo.toLowerCase().includes(search.toLowerCase()) ||
      v.supplier?.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Car className="h-6 w-6 text-[#FCD223]" />
            Airport Transfer Vehicle Approvals
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Review, verify, and approve supplier airport transfer fleet inventory platform-wide.
          </p>
        </div>

        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search vehicle or supplier..."
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
          No airport transfer vehicles found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#2A2A2A] bg-[#141414]">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="border-b border-[#2A2A2A] bg-[#1A1A1A] text-xs uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Fixed Tariff</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Approval Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-[#1A1A1A]/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">{v.make} {v.model}</p>
                    <p className="text-xs text-gray-400 font-mono">{v.registrationNo}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-gray-400" />
                      {v.supplier?.companyName || 'Independent Partner'}
                    </p>
                    <p className="text-xs text-gray-500">{v.supplier?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#2A2A2A] text-gray-200">
                      {CATEGORY_NAMES[v.vehicleType] || v.vehicleType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {v.passengerCapacity} Pax • {v.luggageCapacity} Bags
                  </td>
                  <td className="px-6 py-4 font-bold text-[#FCD223]">
                    {v.currency} {Number(v.fixedPrice).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        v.isApproved
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {v.isApproved ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {v.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleApproval(v.id, v.isApproved)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        v.isApproved
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                          : 'bg-emerald-500 text-black hover:bg-emerald-400'
                      }`}
                    >
                      {v.isApproved ? 'Revoke Approval' : 'Approve Vehicle'}
                    </button>
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
