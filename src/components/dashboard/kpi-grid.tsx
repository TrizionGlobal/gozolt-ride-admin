'use client';

import { Activity, Users, UserCheck, Building2, Euro, Car, FileCheck, ClipboardCheck, Heart, type LucideIcon } from 'lucide-react';
import { KpiCard } from './kpi-card';
import type { DashboardKpi } from '@/services/admin/dashboard.types';

interface KpiGridProps {
  kpis: DashboardKpi | null;
  isLoading: boolean;
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return num.toLocaleString();
  }
  return String(num);
}

export function KpiGrid({ kpis, isLoading }: KpiGridProps) {
  const cards: { label: string; value: string; change: number; icon: LucideIcon; prefix?: string; href: string }[] = [
    {
      label: 'Active Rides',
      value: kpis ? formatNumber(kpis.activeRides) : '0',
      change: 12,
      icon: Activity,
      href: '/ride-management',
    },
    {
      label: 'Online Drivers',
      value: kpis ? formatNumber(kpis.onlineDrivers) : '0',
      change: 12,
      icon: UserCheck,
      href: '/driver-management',
    },
    {
      label: 'Total Users',
      value: kpis ? formatNumber(kpis.totalUsers) : '0',
      change: 12,
      icon: Users,
      href: '/user-management',
    },
    {
      label: 'Suppliers',
      value: kpis ? formatNumber(kpis.totalSuppliers) : '0',
      change: 12,
      icon: Building2,
      href: '/supplier-management',
    },
    {
      label: 'Today Revenue',
      value: kpis ? formatNumber(kpis.todayRevenue) : '0',
      change: 12,
      icon: Euro,
      prefix: '€',
      href: '/payments',
    },
    {
      label: 'Today Rides',
      value: kpis ? formatNumber(kpis.todayRides) : '0',
      change: 12,
      icon: Car,
      href: '/ride-management',
    },
    {
      label: 'Pending Docs',
      value: kpis ? formatNumber(kpis.pendingDocuments) : '0',
      change: -2,
      icon: FileCheck,
      href: '/document-review',
    },
    {
      label: 'Pending Approvals',
      value: kpis ? formatNumber(kpis.pendingSupplierApprovals) : '0',
      change: 5,
      icon: ClipboardCheck,
      href: '/supplier-management',
    },
    {
      label: 'Tip Revenue',
      value: kpis ? formatNumber(kpis.tipRevenue) : '0',
      change: 15,
      icon: Heart,
      prefix: '€',
      href: '/payments?tab=tip',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {cards.map((card) => (
        <KpiCard
          key={card.label}
          label={card.label}
          value={card.value}
          change={card.change}
          icon={card.icon}
          prefix={card.prefix}
          isLoading={isLoading}
          href={card.href}
        />
      ))}
    </div>
  );
}
