'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GdprKpiCards } from '@/components/gdpr/gdpr-kpi-cards';
import { BreachTable } from '@/components/gdpr/breach-table';
import { BreachCreateModal } from '@/components/gdpr/breach-create-modal';
import { RetentionConfigCard } from '@/components/gdpr/retention-config-card';
import { CookieConsentStats } from '@/components/gdpr/cookie-consent-stats';
import { ProcessingRestrictionsTable } from '@/components/gdpr/processing-restrictions-table';
import { useGdpr } from '@/hooks/use-gdpr';

type GdprTab = 'breaches' | 'retention' | 'cookies' | 'restrictions';

const TABS: { key: GdprTab; label: string }[] = [
  { key: 'breaches', label: 'Breaches' },
  { key: 'retention', label: 'Data Retention' },
  { key: 'cookies', label: 'Cookie Consent' },
  { key: 'restrictions', label: 'Processing Restrictions' },
];

export default function GdprPage() {
  const [activeTab, setActiveTab] = useState<GdprTab>('breaches');
  const [createOpen, setCreateOpen] = useState(false);

  const {
    kpis,
    breaches,
    retentionConfig,
    cookieStats,
    restrictions,
    loading,
    createBreach,
    updateBreachStatus,
  } = useGdpr();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">GDPR &amp; Privacy</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage data breaches, retention policies, consent, and processing restrictions
          </p>
        </div>
        {activeTab === 'breaches' && (
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-[#FACC15] text-black hover:bg-[#E5B800] font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Report Breach
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#2A2A2A]">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === key
                ? 'text-[#FACC15]'
                : 'text-[#6B7280] hover:text-white'
            }`}
          >
            {label}
            {activeTab === key && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FACC15]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'breaches' && (
        <div className="space-y-6">
          <GdprKpiCards kpis={kpis} loading={loading} />
          <BreachTable
            breaches={breaches}
            loading={loading}
            onUpdateStatus={updateBreachStatus}
          />
        </div>
      )}

      {activeTab === 'retention' && (
        <RetentionConfigCard config={retentionConfig} loading={loading} />
      )}

      {activeTab === 'cookies' && (
        <CookieConsentStats stats={cookieStats} loading={loading} />
      )}

      {activeTab === 'restrictions' && (
        <ProcessingRestrictionsTable restrictions={restrictions} loading={loading} />
      )}

      {/* Create Breach Modal */}
      <BreachCreateModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={createBreach}
      />
    </div>
  );
}
