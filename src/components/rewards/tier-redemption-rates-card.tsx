'use client';

import { useState } from 'react';
import { Pencil, X, Save, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TIER_REDEMPTION_FIELDS } from '@/services/admin/reward.types';
import type { RewardConfig, UpdateRewardConfigPayload } from '@/services/admin/reward.types';
import { toast } from 'sonner';

interface TierRedemptionRatesCardProps {
  config: RewardConfig;
  saving: boolean;
  onSave: (payload: UpdateRewardConfigPayload) => Promise<boolean | undefined>;
}

export function TierRedemptionRatesCard({
  config,
  saving,
  onSave,
}: TierRedemptionRatesCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, number>>({});

  const getFieldValue = (key: string): number => {
    if (key === 'bronzeRedemptionRate') {
      return config.bronzeRedemptionRate ?? config.tierRedemptionRates?.BRONZE ?? 1.0;
    }
    if (key === 'silverRedemptionRate') {
      return config.silverRedemptionRate ?? config.tierRedemptionRates?.SILVER ?? 3.0;
    }
    if (key === 'goldRedemptionRate') {
      return config.goldRedemptionRate ?? config.tierRedemptionRates?.GOLD ?? 5.0;
    }
    if (key === 'platinumRedemptionRate') {
      return config.platinumRedemptionRate ?? config.tierRedemptionRates?.PLATINUM ?? 7.0;
    }
    return 0;
  };

  const handleEdit = () => {
    const values: Record<string, number> = {};
    TIER_REDEMPTION_FIELDS.forEach((f) => {
      values[f.key] = getFieldValue(f.key);
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
    TIER_REDEMPTION_FIELDS.forEach((f) => {
      const orig = getFieldValue(f.key);
      if (editValues[f.key] !== undefined && editValues[f.key] !== orig) {
        (payload as Record<string, number>)[f.key] = editValues[f.key];
      }
    });

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    const success = await onSave(payload);
    if (success) {
      toast.success('Tier redemption rates updated successfully');
      setIsEditing(false);
      setEditValues({});
    }
  };

  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-[#22C55E]" />
          <h3 className="text-base font-semibold text-white">Tier Redemption Rates (€ / 100 Coins)</h3>
        </div>
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
              className="h-8 text-xs bg-[#22C55E] text-black hover:bg-[#16A34A]"
            >
              <Save className="mr-1 h-3.5 w-3.5" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={handleEdit}
            className="h-8 text-xs bg-[#22C55E] text-black hover:bg-[#16A34A]"
          >
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </div>

      <div>
        {TIER_REDEMPTION_FIELDS.map((field) => {
          const origValue = getFieldValue(field.key);
          const value = isEditing ? editValues[field.key] ?? origValue : origValue;
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
                    <span className="text-sm font-semibold text-[#22C55E]">€</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      value={value}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          [field.key]: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-20 h-8 rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-2 text-sm text-white text-right focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-xs text-[#6B7280] w-16">/ 100 coins</span>
                  </>
                ) : (
                  <span className="text-sm font-semibold text-[#22C55E]">
                    €{Number(value).toFixed(2)}{' '}
                    <span className="text-xs text-[#6B7280] font-normal">/ 100 coins</span>
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

