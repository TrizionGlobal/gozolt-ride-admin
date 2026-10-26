'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plane, Car, FileText, CreditCard, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface AdminTransferStats {
  totalTransfers: number;
  scheduledToday: number;
  activeTransfers: number;
  pendingAssignment: number;
  gmv: number;
}

export default function AirportTransfersDashboardPage() {
  const [stats, setStats] = useState<AdminTransferStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await apiClient.get('/airport-transfers/admin/dashboard-stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch admin airport transfer stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#141414]">
          <Image
            src="/airport-transfers-icon.png"
            alt="Airport Transfers"
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">
            Airport Transfers Dashboard
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Manage airport transfer bookings, passengers, suppliers, vehicles and scheduled journeys.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          label="Total Transfers"
          value={loading ? '—' : String(stats?.totalTransfers ?? 0)}
          description="All transfer bookings"
        />

        <DashboardCard
          label="Scheduled Today"
          value={loading ? '—' : String(stats?.scheduledToday ?? 0)}
          description="Transfers scheduled today"
        />

        <DashboardCard
          label="Active Transfers"
          value={loading ? '—' : String(stats?.activeTransfers ?? 0)}
          description="Currently in progress"
        />

        <DashboardCard
          label="Pending Assignment"
          value={loading ? '—' : String(stats?.pendingAssignment ?? 0)}
          description="Awaiting driver dispatch"
        />
      </div>

      {/* Operational Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6 flex flex-col justify-between">
          <div>
            <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-400 mb-4">
              <Car className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Vehicle Approvals</h3>
            <p className="mt-1 text-sm text-[#6B7280]">
              Review and verify supplier airport transport vehicles, passenger capacity, and commercial permits.
            </p>
          </div>
          <Link
            href="/airport-transfers/vehicles"
            className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#FCD223] hover:underline"
          >
            Review Vehicles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6 flex flex-col justify-between">
          <div>
            <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Booking Oversight</h3>
            <p className="mt-1 text-sm text-[#6B7280]">
              Audit platform-wide airport transfer journeys, flight arrival tracking, and passenger milestones.
            </p>
          </div>
          <Link
            href="/airport-transfers/bookings"
            className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#FCD223] hover:underline"
          >
            Audit Bookings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-6 flex flex-col justify-between">
          <div>
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Payments & Settlements</h3>
            <p className="mt-1 text-sm text-[#6B7280]">
              Track transfer gross GMV, platform revenue cuts (10%), and supplier settlement disbursements.
            </p>
          </div>
          <Link
            href="/airport-transfers/payments"
            className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#FCD223] hover:underline"
          >
            View Settlements <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  label: string;
  value: string;
  description: string;
}

function DashboardCard({
  label,
  value,
  description,
}: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 transition-colors hover:border-[#FCD223]/40">
      <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold text-[#FCD223]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#9CA3AF]">
        {description}
      </p>
    </div>
  );
}