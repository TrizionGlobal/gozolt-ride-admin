'use client';

import { useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SurgeMapPanel } from '@/components/surge/surge-map-panel';
import { SurgeZoneListPanel } from '@/components/surge/surge-zone-list-panel';
import { SurgeZoneDetail } from '@/components/surge/surge-zone-detail';
import { SurgeHistoryChart } from '@/components/surge/surge-history-chart';
import { SurgeZoneEditPanel } from '@/components/surge/surge-zone-edit-panel';
import { SurgeServiceMap } from '@/components/surge/surge-service-map';
import { SurgeGlobalRules } from '@/components/surge/surge-global-rules';
import { SurgeZoneListFull } from '@/components/surge/surge-zone-list-full';
import { SurgeZoneOverrides } from '@/components/surge/surge-zone-overrides';
import { SurgeAddZoneModal } from '@/components/surge/surge-add-zone-modal';
import { SurgeDeleteZoneModal } from '@/components/surge/surge-delete-zone-modal';
import { useSurgeZones, useSurgeHistory } from '@/hooks/use-surge';
import type { SurgeZoneType } from '@/services/admin/surge.types';

export default function SurgeConfigPage() {
  const {
    zones,
    loading,
    selectedZone,
    selectedZoneId,
    selectZone,
    toggleZone,
    updateZone,
    createZone,
    deleteZone,
  } = useSurgeZones();

  const { history, loading: historyLoading } = useSurgeHistory(selectedZoneId);

  const [addOpen, setAddOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; zoneId: string; zoneName: string }>({
    open: false,
    zoneId: '',
    zoneName: '',
  });

  const handleCreateZone = useCallback(
    async (data: { name: string; multiplier: number; zoneType: SurgeZoneType }) => {
      await createZone({
        name: data.name,
        multiplier: data.multiplier,
        polygon: {
          type: 'Polygon',
          coordinates: [[[14.45, 35.88], [14.46, 35.88], [14.46, 35.87], [14.45, 35.87], [14.45, 35.88]]],
        },
        isActive: true,
      });
    },
    [createZone],
  );

  const handleDeleteZone = useCallback(
    async (id: string) => {
      await deleteZone(id);
      setDeleteModal({ open: false, zoneId: '', zoneName: '' });
    },
    [deleteZone],
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-8 w-56 bg-[#1A1A1A]" />
          <Skeleton className="h-4 w-72 bg-[#1A1A1A]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
          <Skeleton className="h-72 rounded-lg bg-[#1A1A1A]" />
          <Skeleton className="h-72 rounded-lg bg-[#1A1A1A]" />
        </div>
        <Skeleton className="h-60 rounded-lg bg-[#1A1A1A]" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-64 rounded-lg bg-[#1A1A1A]" />
          <Skeleton className="h-64 rounded-lg bg-[#1A1A1A]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Surge Configuration</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Zone management &amp; dynamic pricing rules
        </p>
      </div>

      {/* Row 1: Map + Zones sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        <SurgeMapPanel
          zones={zones}
          selectedZoneId={selectedZoneId}
          onSelectZone={selectZone}
          onAddZone={() => setAddOpen(true)}
        />
        <SurgeZoneListPanel
          zones={zones}
          selectedZoneId={selectedZoneId}
          onSelectZone={selectZone}
          onToggleZone={toggleZone}
          onAddZone={() => setAddOpen(true)}
        />
      </div>

      {/* Row 2: Selected zone detail */}
      {selectedZone && (
        <SurgeZoneDetail
          zone={selectedZone}
          onEdit={() => {
            // Scroll to edit panel
            document.getElementById('surge-edit-panel')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onDelete={() =>
            setDeleteModal({
              open: true,
              zoneId: selectedZone.id,
              zoneName: selectedZone.name,
            })
          }
        />
      )}

      {/* Row 3: Chart + Edit panel */}
      {selectedZone && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SurgeHistoryChart data={history} loading={historyLoading} />
          <div id="surge-edit-panel">
            <SurgeZoneEditPanel zone={selectedZone} onUpdate={updateZone} />
          </div>
        </div>
      )}

      {/* Row 4: Service map + Global rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SurgeServiceMap zones={zones} />
        <SurgeGlobalRules initialRules={{ calculationFrequency: 5, maxSurgeCap: 3.0, thresholds: [] }} />
      </div>

      {/* Row 5: Zone list + Overrides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SurgeZoneListFull
          zones={zones}
          selectedZoneId={selectedZoneId}
          onSelectZone={selectZone}
        />
        <SurgeZoneOverrides />
      </div>

      {/* Modals */}
      <SurgeAddZoneModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={handleCreateZone}
      />

      {deleteModal.zoneId && (
        <SurgeDeleteZoneModal
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
          zoneName={deleteModal.zoneName}
          zoneId={deleteModal.zoneId}
          onDelete={handleDeleteZone}
        />
      )}
    </div>
  );
}
