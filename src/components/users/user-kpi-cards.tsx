'use client';

import { Users, UserCheck, Ban, UserX } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/kpi-card';
import type { UserKpis } from '@/services/admin/user.types';

interface UserKpiCardsProps {
  kpis: UserKpis;
  isLoading?: boolean;
}

export function UserKpiCards({ kpis, isLoading }: UserKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Total Vehicles"
        value={kpis.totalUsers.toLocaleString()}
        change={12}
        icon={Users}
        isLoading={isLoading}
      />
      <KpiCard
        label="Active on Road"
        value={kpis.activeUsers.toLocaleString()}
        change={12}
        icon={UserCheck}
        isLoading={isLoading}
      />
      <div className={kpis.bannedUsers > 0 ? 'rounded-lg border border-yellow-500/50' : ''}>
        <KpiCard
          label="Pending Inspection"
          value={kpis.bannedUsers.toLocaleString()}
          change={12}
          icon={Ban}
          isLoading={isLoading}
        />
      </div>
      <KpiCard
        label="Suspended"
        value={kpis.inactiveUsers.toLocaleString()}
        change={-12}
        icon={UserX}
        isLoading={isLoading}
      />
    </div>
  );
}
