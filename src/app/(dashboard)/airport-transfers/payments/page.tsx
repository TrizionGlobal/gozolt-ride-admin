'use client';

import { useState, useEffect } from 'react';
import { CreditCard, DollarSign, ArrowUpRight, CheckCircle2, Building2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function AdminAirportTransfersPaymentsPage() {
  const [data, setData] = useState<{
    totalRevenue: number;
    platformCommission: number;
    supplierPayouts: number;
    settlementsCount: number;
    items: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true);
        const res = await apiClient.get('/airport-transfers/admin/payments');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch airport transfer payments:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-[#FCD223]" />
          Airport Transfer Payments & Settlements
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Monitor gross booking revenue, platform fee deductions (10%), and supplier settlement balances.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">Gross Transfer Volume</p>
          <p className="mt-3 text-3xl font-bold text-white">
            {loading ? '—' : `€${(data?.totalRevenue ?? 0).toFixed(2)}`}
          </p>
          <p className="mt-1 text-xs text-[#9CA3AF]">{data?.settlementsCount ?? 0} completed transfers</p>
        </div>

        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">Platform Revenue (10%)</p>
          <p className="mt-3 text-3xl font-bold text-[#FCD223]">
            {loading ? '—' : `€${(data?.platformCommission ?? 0).toFixed(2)}`}
          </p>
          <p className="mt-1 text-xs text-[#9CA3AF]">Earned service fee</p>
        </div>

        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">Supplier Payout Obligations</p>
          <p className="mt-3 text-3xl font-bold text-emerald-400">
            {loading ? '—' : `€${(data?.supplierPayouts ?? 0).toFixed(2)}`}
          </p>
          <p className="mt-1 text-xs text-emerald-500/80">Pending settlement disbursement</p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FCD223] border-t-transparent" />
        </div>
      ) : !data?.items || data.items.length === 0 ? (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-12 text-center text-gray-400 text-sm">
          No completed airport transfers recorded yet for settlement.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#2A2A2A] bg-[#141414]">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="border-b border-[#2A2A2A] bg-[#1A1A1A] text-xs uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4">Booking Ref</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Completed Date</th>
                <th className="px-6 py-4">Gross Fare</th>
                <th className="px-6 py-4">Platform Fee (10%)</th>
                <th className="px-6 py-4">Net Supplier Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {data.items.map((item) => {
                const total = Number(item.grandTotal);
                const commission = total * 0.10;
                const net = total - commission;
                return (
                  <tr key={item.id} className="hover:bg-[#1A1A1A]/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#FCD223]">{item.bookingReference}</td>
                    <td className="px-6 py-4">{item.supplier?.companyName || 'Independent'}</td>
                    <td className="px-6 py-4 text-xs text-gray-400">{new Date(item.updatedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-semibold text-white">€{total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-xs text-red-400">-€{commission.toFixed(2)}</td>
                    <td className="px-6 py-4 font-bold text-emerald-400">€{net.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
