'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { VehicleType } from '@/types';
import { Button } from '@/components/ui/button';

interface VehicleFiltersPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplierId: string;
  onSupplierIdChange: (value: string) => void;
  vehicleType: string;
  onVehicleTypeChange: (value: string) => void;
}

const SUPPLIER_OPTIONS = [
  { value: '', label: 'All Suppliers' },
  { value: 's-001-malta-premier', label: 'Malta Cabs Ltd' },
  { value: 's-002-island-express', label: 'Island Express' },
  { value: 's-003-goride-malta', label: 'GoRide Malta' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: VehicleType.GO, label: 'Go' },
  { value: VehicleType.STANDARD, label: 'Standard' },
  { value: VehicleType.COMFORT, label: 'Comfort' },
  { value: VehicleType.GREEN, label: 'Green' },
  { value: VehicleType.PRIME, label: 'Prime' },
  { value: VehicleType.PREMIUM_XL, label: 'Premium XL' },
  { value: VehicleType.VAN, label: 'Van' },
  { value: VehicleType.CHAUFFEUR, label: 'Chauffeur' },
];

export function VehicleFiltersPopover({
  open,
  onOpenChange,
  supplierId,
  onSupplierIdChange,
  vehicleType,
  onVehicleTypeChange,
}: VehicleFiltersPopoverProps) {
  const [localSupplier, setLocalSupplier] = useState(supplierId);
  const [localType, setLocalType] = useState(vehicleType);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setLocalSupplier(supplierId);
      setLocalType(vehicleType);
    }
  }, [open, supplierId, vehicleType]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onOpenChange]);

  if (!open) return null;

  const handleApply = () => {
    onSupplierIdChange(localSupplier);
    onVehicleTypeChange(localType);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalSupplier('');
    setLocalType('');
    onSupplierIdChange('');
    onVehicleTypeChange('');
    onOpenChange(false);
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 z-50 w-72 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-4 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Filters</h3>
        <button
          onClick={() => onOpenChange(false)}
          className="text-[#6B7280] hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-xs text-[#9CA3AF]">Vehicle Type</label>
          <select
            value={localType}
            onChange={(e) => setLocalType(e.target.value)}
            className="w-full h-9 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-[#9CA3AF]">Supplier</label>
          <select
            value={localSupplier}
            onChange={(e) => setLocalSupplier(e.target.value)}
            className="w-full h-9 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20"
          >
            {SUPPLIER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#2A2A2A]">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="flex-1 text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] text-xs"
        >
          Reset
        </Button>
        <Button
          size="sm"
          onClick={handleApply}
          className="flex-1 bg-[#FACC15] text-black hover:bg-[#EAB308] text-xs font-medium"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
