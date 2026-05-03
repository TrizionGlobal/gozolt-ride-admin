'use client';

import { useState } from 'react';
import { Pencil, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TIER_THRESHOLD_FIELDS } from '@/services/admin/reward.types';
import type { RewardConfig, UpdateRewardConfigPayload } from '@/services/admin/reward.types';
import { toast } from 'sonner';

interface TierThresholdsCardProps {
  config: RewardConfig;
  saving: boolean;
  onSave: (payload: UpdateRewardConfigPayload) => Promise<boolean | undefined>;
}

export function TierThresholdsCard({ config, saving, onSave }: TierThresholdsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, number>>({});

  const handleEdit = () => {
    const values: Record<string, number> = {};
    TIER_THRESHOLD_FIELDS.forEach((f) => {
      values[f.key] = config[f.key];
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
    TIER_THRESHOLD_FIELDS.forEach((f) => {
      if (editValues[f.key] !== config[f.key]) {
        (payload as Record<string, number>)[f.key] = editValues[f.key];
      }
    });

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    const success = await onSave(payload);
    if (success) {
      toast.success('Tier thresholds updated successfully');
      setIsEditing(false);
      setEditValues({});
    }
  };

  return (
    <div className="rounded-lg border-2 border-dashed border-[#FACC15]/60 bg-[#141414] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white">Tier Thresholds</h3>
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
        {TIER_THRESHOLD_FIELDS.map((field) => {
          const value = isEditing ? editValues[field.key] ?? config[field.key] : config[field.key];
          return (
            <div
              key={field.key}
              className="flex items-center justify-between py-2.5 border-b border-[#2A2A2A]/50 last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: field.dotColor }}
                />
                <span className={`text-sm font-medium ${field.labelColor}`}>
                  {field.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {isEditing ? (
                  <>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={value}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          [field.key]: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-20 h-8 rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-2 text-sm text-white text-right focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-xs text-[#6B7280] w-10">{field.unit}</span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-white">
                    {value.toLocaleString()}{' '}
                    <span className="text-[#6B7280]">{field.unit}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
