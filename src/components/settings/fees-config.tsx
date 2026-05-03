'use client';

import { useState } from 'react';
import { Pencil, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FeeCard } from './fee-card';
import { FEE_FIELDS, type FeeConfig } from '@/services/admin/settings.types';
import { toast } from 'sonner';

interface FeesConfigProps {
  fees: FeeConfig | null;
  loading: boolean;
  saving: boolean;
  onSave: (updated: Partial<FeeConfig>) => Promise<boolean>;
}

export function FeesConfig({ fees, loading, saving, onSave }: FeesConfigProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, number>>({});

  const handleEdit = () => {
    if (!fees) return;
    const values: Record<string, number> = {};
    FEE_FIELDS.forEach((f) => {
      values[f.key] = fees[f.key];
    });
    setEditValues(values);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const handleSave = async () => {
    if (!fees) return;
    const payload: Partial<FeeConfig> = {};
    FEE_FIELDS.forEach((f) => {
      if (editValues[f.key] !== fees[f.key]) {
        (payload as Record<string, number>)[f.key] = editValues[f.key];
      }
    });

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    const success = await onSave(payload);
    if (success) {
      toast.success('Fee configuration updated');
      setIsEditing(false);
      setEditValues({});
    }
  };

  if (loading || !fees) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 bg-[#1A1A1A] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-end mb-4">
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

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEE_FIELDS.map((field) => (
          <FeeCard
            key={field.key}
            label={field.label}
            description={field.description}
            value={isEditing ? (editValues[field.key] ?? fees[field.key]) : fees[field.key]}
            isEditing={isEditing}
            onChange={(v) => setEditValues((prev) => ({ ...prev, [field.key]: v }))}
          />
        ))}
      </div>
    </div>
  );
}
