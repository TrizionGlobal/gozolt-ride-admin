'use client';

import { useState } from 'react';
import { Pencil, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PricingFieldRow } from './pricing-field-row';
import { CANCELLATION_FIELDS } from '@/services/admin/pricing.types';
import type { PricingRule, UpdatePricingPayload } from '@/services/admin/pricing.types';
import { toast } from 'sonner';

interface CancellationPolicyCardProps {
  rule: PricingRule;
  saving: boolean;
  onSave: (payload: UpdatePricingPayload) => Promise<boolean | undefined>;
}

export function CancellationPolicyCard({ rule, saving, onSave }: CancellationPolicyCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, number>>({});

  const handleEdit = () => {
    const values: Record<string, number> = {};
    CANCELLATION_FIELDS.forEach((f) => {
      values[f.key] = rule[f.key];
    });
    setEditValues(values);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const handleSave = async () => {
    const payload: UpdatePricingPayload = {};
    CANCELLATION_FIELDS.forEach((f) => {
      if (editValues[f.key] !== rule[f.key]) {
        (payload as Record<string, number>)[f.key] = editValues[f.key];
      }
    });

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    const success = await onSave(payload);
    if (success) {
      toast.success('Cancellation policy updated successfully');
      setIsEditing(false);
      setEditValues({});
    }
  };

  return (
    <div className="rounded-lg border-2 border-dashed border-[#FACC15]/60 bg-[#141414] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white">Cancellation Policy</h3>
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

      {/* Fields */}
      <div>
        {CANCELLATION_FIELDS.map((field) => (
          <PricingFieldRow
            key={field.key}
            label={field.label}
            value={isEditing ? editValues[field.key] ?? rule[field.key] : rule[field.key]}
            unit={field.unit}
            isEditing={isEditing}
            onChange={(v) => setEditValues((prev) => ({ ...prev, [field.key]: v }))}
          />
        ))}
      </div>
    </div>
  );
}
