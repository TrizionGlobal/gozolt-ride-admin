'use client';

import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { SurgeZoneItem } from '@/services/admin/surge.types';

interface SurgeZoneEditPanelProps {
  zone: SurgeZoneItem;
  onUpdate: (id: string, data: { name?: string; multiplier?: number; isActive?: boolean }) => Promise<void>;
}

export function SurgeZoneEditPanel({ zone, onUpdate }: SurgeZoneEditPanelProps) {
  const [name, setName] = useState(zone.name);
  const [override, setOverride] = useState(String(zone.multiplier));
  const [saving, setSaving] = useState(false);

  // Sync when zone changes
  useEffect(() => {
    setName(zone.name);
    setOverride(String(zone.multiplier));
  }, [zone.id, zone.name, zone.multiplier]);

  const handleSave = async () => {
    const numOverride = parseFloat(override) || zone.multiplier;
    const updates: { name?: string; multiplier?: number } = {};
    if (name !== zone.name) updates.name = name;
    if (numOverride !== zone.multiplier) updates.multiplier = numOverride;
    if (Object.keys(updates).length === 0) return;

    setSaving(true);
    try {
      await onUpdate(zone.id, updates);
      toast.success('Zone updated');
    } catch {
      toast.error('Failed to update zone');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (checked: boolean) => {
    try {
      await onUpdate(zone.id, { isActive: checked });
      toast.success(checked ? 'Zone enabled' : 'Zone disabled');
    } catch {
      toast.error('Failed to toggle zone');
    }
  };

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      <h3 className="text-sm font-semibold text-white mb-4">
        Zone: {zone.name}
      </h3>

      <div className="space-y-4">
        {/* Zone Name */}
        <div className="space-y-1.5">
          <label className="text-xs text-[#6B7280]">Zone Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-9 rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
          />
        </div>

        {/* Current Multiplier */}
        <div className="space-y-1.5">
          <label className="text-xs text-[#6B7280]">Current Multiplier</label>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-400">
              {zone.multiplier}x
            </span>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
        </div>

        {/* Manual Override */}
        <div className="space-y-1.5">
          <label className="text-xs text-[#6B7280]">Manual Override</label>
          <input
            type="number"
            step="0.1"
            min="1.0"
            max="10.0"
            value={override}
            onChange={(e) => setOverride(e.target.value)}
            className="w-full h-9 rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
          />
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-[#9CA3AF]">Active</label>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                zone.isActive
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {zone.isActive ? 'Enabled' : 'Disabled'}
            </span>
            <Switch
              checked={zone.isActive}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-[#22C55E]"
            />
          </div>
        </div>

        {/* Save button */}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#FACC15] text-black hover:bg-[#E5B800] disabled:opacity-40"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
