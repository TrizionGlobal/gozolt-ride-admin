'use client';

import { useState } from 'react';
import { Pencil, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FareConfigRow } from './fare-config-row';
import { FARE_CONFIG_COLUMNS } from '@/services/admin/settings.types';
import type { PricingRule, UpdatePricingPayload } from '@/services/admin/pricing.types';
import { toast } from 'sonner';

interface FareConfigTableProps {
  rules: PricingRule[];
  loading: boolean;
  saving: boolean;
  onSave: (id: string, payload: UpdatePricingPayload) => Promise<boolean>;
}

export function FareConfigTable({ rules, loading, saving, onSave }: FareConfigTableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, number>>({});

  const handleEdit = () => {
    const values: Record<string, number> = {};
    rules.forEach((rule) => {
      FARE_CONFIG_COLUMNS.forEach((col) => {
        values[`${rule.id}_${col.key}`] = rule[col.key];
      });
    });
    setEditValues(values);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const handleSave = async () => {
    let anyUpdated = false;

    for (const rule of rules) {
      const payload: UpdatePricingPayload = {};
      FARE_CONFIG_COLUMNS.forEach((col) => {
        const newVal = editValues[`${rule.id}_${col.key}`];
        if (newVal !== undefined && newVal !== rule[col.key]) {
          (payload as Record<string, number>)[col.key] = newVal;
        }
      });

      if (Object.keys(payload).length > 0) {
        const success = await onSave(rule.id, payload);
        if (success) anyUpdated = true;
      }
    }

    if (anyUpdated) {
      toast.success('Fare configuration updated');
    }
    setIsEditing(false);
    setEditValues({});
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
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

      {/* Table */}
      <div className="rounded-lg border border-[#2A2A2A] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#2A2A2A] hover:bg-transparent bg-[#0A0A0A]">
              <TableHead className="text-[#9CA3AF] text-xs font-medium">VEHICLE TYPE</TableHead>
              {FARE_CONFIG_COLUMNS.map((col) => (
                <TableHead key={col.key} className="text-[#9CA3AF] text-xs font-medium">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <FareConfigRow
                key={rule.id}
                rule={rule}
                isEditing={isEditing}
                editValues={editValues}
                onEditChange={(key, value) =>
                  setEditValues((prev) => ({ ...prev, [key]: value }))
                }
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
