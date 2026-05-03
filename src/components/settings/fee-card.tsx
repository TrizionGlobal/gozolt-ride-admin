'use client';

import { Input } from '@/components/ui/input';

interface FeeCardProps {
  label: string;
  description: string;
  value: number;
  isEditing: boolean;
  onChange: (value: number) => void;
}

export function FeeCard({ label, description, value, isEditing, onChange }: FeeCardProps) {
  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-white">{label}</h4>
        <p className="text-xs text-[#6B7280] mt-0.5">{description}</p>
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">€</span>
        {isEditing ? (
          <Input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="pl-7 h-10 bg-[#0A0A0A] border-[#2A2A2A] text-white focus:border-[#FACC15] focus:ring-[#FACC15]/20"
          />
        ) : (
          <div className="pl-7 h-10 flex items-center bg-[#0A0A0A] rounded-md border border-[#2A2A2A] text-white text-sm">
            {value.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}
