'use client';

import { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { SurgeZoneType } from '@/services/admin/surge.types';

interface SurgeAddZoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: { name: string; multiplier: number; zoneType: SurgeZoneType }) => Promise<void>;
}

export function SurgeAddZoneModal({
  open,
  onOpenChange,
  onCreate,
}: SurgeAddZoneModalProps) {
  const [name, setName] = useState('');
  const [zoneType, setZoneType] = useState<SurgeZoneType>('surge');
  const [multiplier, setMultiplier] = useState('1.5');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 0 && parseFloat(multiplier) > 0 && !submitting;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onCreate({
        name: name.trim(),
        multiplier: parseFloat(multiplier),
        zoneType,
      });
      toast.success(`Zone "${name.trim()}" created`);
      onOpenChange(false);
      resetForm();
    } catch {
      toast.error('Failed to create zone');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setZoneType('surge');
    setMultiplier('1.5');
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Add Surge Zone
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Zone Name */}
          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">
              Zone Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter zone name..."
              className="w-full h-10 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
            />
          </div>

          {/* Zone Type */}
          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">Zone Type</label>
            <select
              value={zoneType}
              onChange={(e) => setZoneType(e.target.value as SurgeZoneType)}
              className="w-full h-10 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20 appearance-none"
            >
              <option value="surge" className="bg-[#141414]">Surge</option>
              <option value="pickup" className="bg-[#141414]">Pickup</option>
              <option value="standard" className="bg-[#141414]">Standard</option>
            </select>
          </div>

          {/* Initial Multiplier */}
          <div className="space-y-2">
            <label className="text-sm text-[#9CA3AF]">
              Initial Multiplier <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="1.0"
              value={multiplier}
              onChange={(e) => setMultiplier(e.target.value)}
              className="w-full h-10 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
            />
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2 rounded-md bg-yellow-500/10 border border-yellow-500/20 px-3 py-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-400/90">
              Zone polygon can be defined on the map after creation.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canSubmit}
            className="bg-[#FACC15] text-black hover:bg-[#E5B800] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </span>
            ) : (
              'Create Zone'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
