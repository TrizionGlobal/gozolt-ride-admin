'use client';

import { useState } from 'react';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { DisputeKpiCards } from '@/components/disputes/dispute-kpi-cards';
import { DisputeTabs } from '@/components/disputes/dispute-tabs';
import { DisputeCardList } from '@/components/disputes/dispute-card-list';
import { useDisputes, useDisputeKPIs, useDisputeTabCounts } from '@/hooks/use-disputes';
import type { DisputeTab } from '@/services/admin/dispute.types';

export default function DisputesPage() {
  const [activeTab, setActiveTab] = useState<DisputeTab>('all');
  const [search, setSearch] = useState('');

  const { disputes, loading, updateStatus, addReply } = useDisputes(activeTab, search);
  const { kpis, loading: kpiLoading } = useDisputeKPIs();
  const counts = useDisputeTabCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Disputes</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Review and resolve ride disputes
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs font-medium text-[#22C55E]">System Online</span>
        </div>
      </div>

      {/* KPI Cards */}
      <DisputeKpiCards kpis={kpis} loading={kpiLoading} />

      {/* Tabs + Search */}
      <DisputeTabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSearch('');
        }}
        search={search}
        onSearchChange={(v: string) => setSearch(sanitizeSearchQuery(v))}
        counts={counts}
      />

      {/* Dispute Cards */}
      <DisputeCardList
        disputes={disputes}
        loading={loading}
        onStatusChange={updateStatus}
        onReply={addReply}
      />
    </div>
  );
}
