'use client';

import { Car, CheckCircle2, Clock, Ban } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/kpi-card';
import type { VehicleKpis } from '@/services/admin/vehicle.types';

interface VehicleKpiCardsProps {
  kpis: VehicleKpis;
  isLoading?: boolean;
}

export function VehicleKpiCards({ kpis, isLoading }: VehicleKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Total Vehicles"
        value={kpis.totalVehicles.toLocaleString()}
        change={12}
        icon={Car}
        isLoading={isLoading}
      />
      <KpiCard
        label="Active on Road"
        value={kpis.activeOnRoad.toLocaleString()}
        change={12}
        icon={CheckCircle2}
        isLoading={isLoading}
      />
      <div className={kpis.pendingInspection > 0 ? 'rounded-lg border border-yellow-500/50' : ''}>
        <KpiCard
          label="Pending Inspection"
          value={kpis.pendingInspection.toLocaleString()}
          change={12}
          icon={Clock}
          isLoading={isLoading}
        />
      </div>
      <KpiCard
        label="Suspended"
        value={kpis.suspended.toLocaleString()}
        change={-12}
        icon={Ban}
        isLoading={isLoading}
      />
    </div>
  );
}
