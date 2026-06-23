'use client';

import { Input } from '@/components/ui/input';
import type { PricingRule } from '@/services/admin/pricing.types';
import { VEHICLE_TYPE_DISPLAY, FARE_CONFIG_COLUMNS } from '@/services/admin/settings.types';
import { TableCell, TableRow } from '@/components/ui/table';

interface FareConfigRowProps {
  rule: PricingRule;
  isEditing: boolean;
  editValues: Record<string, number>;
  onEditChange: (key: string, value: number) => void;
}

export function FareConfigRow({ rule, isEditing, editValues, onEditChange }: FareConfigRowProps) {
  const displayName = VEHICLE_TYPE_DISPLAY[rule.vehicleType] ?? rule.vehicleType;

  const formatValue = (val: any) => {
    if (val == null) return '0.00';
    const num = typeof val === 'number' ? val : Number(val);
    if (isNaN(num)) return '0.00';
    return num.toFixed(2);
  };

  return (
    <TableRow className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]">
      <TableCell className="text-white text-sm font-medium">{displayName}</TableCell>
      {FARE_CONFIG_COLUMNS.map((col) => {
        const valueToDisplay = formatValue(rule[col.key as keyof PricingRule]);
        return (
          <TableCell key={col.key}>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={editValues[`${rule.id}_${col.key}`] ?? rule[col.key as keyof PricingRule] ?? 0}
                onChange={(e) => onEditChange(`${rule.id}_${col.key}`, parseFloat(e.target.value) || 0)}
                className="w-20 h-8 text-xs bg-[#0A0A0A] border-[#2A2A2A] text-white focus:border-[#FACC15] focus:ring-[#FACC15]/20"
              />
            ) : (
              <span className="text-[#9CA3AF] text-sm">{valueToDisplay}</span>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
