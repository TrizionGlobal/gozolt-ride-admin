'use client';

import { Users, Wifi, Clock, Ban } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/kpi-card';
import type { DriverKpis } from '@/services/admin/driver.types';

interface DriverKpiCardsProps {
  kpis: DriverKpis;
  isLoading?: boolean;
}

export function DriverKpiCards({ kpis, isLoading }: DriverKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Active Drivers"
        value={kpis?.activeDrivers?.toLocaleString() ?? '0'}
        change={12}
        icon={Users}
        isLoading={isLoading}
      />
      <KpiCard
        label="Online Now"
        value={kpis?.onlineNow?.toLocaleString() ?? '0'}
        change={8}
        icon={Wifi}
        isLoading={isLoading}
      />
      <KpiCard
        label="Pending Approval"
        value={kpis?.pendingApproval?.toLocaleString() ?? '0'}
        change={-5}
        icon={Clock}
        isLoading={isLoading}
      />
      <KpiCard
        label="Suspended"
        value={kpis?.suspended?.toLocaleString() ?? '0'}
        change={-2}
        icon={Ban}
        isLoading={isLoading}
      />
    </div>
  );
}
