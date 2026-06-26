'use client';

import { useState } from 'react';
import { Pencil, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RewardFieldRow } from './reward-field-row';
import { POINT_EARNING_FIELDS } from '@/services/admin/reward.types';
import type { RewardConfig, UpdateRewardConfigPayload } from '@/services/admin/reward.types';
import { toast } from 'sonner';

interface PointEarningRulesCardProps {
  config: RewardConfig;
  saving: boolean;
  onSave: (payload: UpdateRewardConfigPayload) => Promise<boolean | undefined>;
}

export function PointEarningRulesCard({ config, saving, onSave }: PointEarningRulesCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, number>>({});

  const handleEdit = () => {
    const values: Record<string, number> = {};
    POINT_EARNING_FIELDS.forEach((f) => {
      values[f.key] = config[f.key] ?? 0;
    });
    setEditValues(values);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const handleSave = async () => {
    const payload: UpdateRewardConfigPayload = {};
    POINT_EARNING_FIELDS.forEach((f) => {
      const originalValue = config[f.key as keyof RewardConfig] ?? 0;
      if (editValues[f.key] !== originalValue) {
        (payload as any)[f.key] = editValues[f.key];
      }
    });

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    const success = await onSave(payload);
    if (success) {
      toast.success('Point earning rules updated successfully');
      setIsEditing(false);
      setEditValues({});
    }
  };

  return (
    <div className="rounded-lg border-2 border-dashed border-[#FACC15]/60 bg-[#141414] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white">Point Earning Rules</h3>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={saving}
              className="h-8 text-xs text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A]"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="h-8 text-xs bg-[#FACC15] text-black hover:bg-[#E5B800]"
            >
              <Save className="mr-1 h-3.5 w-3.5" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={handleEdit}
            className="h-8 text-xs bg-[#FACC15] text-black hover:bg-[#E5B800]"
          >
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </div>

      <div>
        {POINT_EARNING_FIELDS.map((field) => (
          <RewardFieldRow
            key={field.key}
            label={field.label}
            value={isEditing ? editValues[field.key] : (config[field.key as keyof RewardConfig] ?? 0)}
            unit={field.unit}
            step={field.step}
            isEditing={isEditing}
            onChange={(v) => setEditValues((prev) => ({ ...prev, [field.key]: v }))}
          />
        ))}
      </div>
    </div>
  );
}
