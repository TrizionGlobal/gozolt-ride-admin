'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { PromoCode, PromoCodeType, CreatePromoPayload } from '@/services/admin/promo.types';
import { toast } from 'sonner';

interface PromoCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPromo: PromoCode | null;
  onCreate: (payload: CreatePromoPayload) => Promise<PromoCode>;
  onUpdate: (id: string, payload: Partial<CreatePromoPayload>) => Promise<PromoCode>;
}

const inputClass =
  'w-full h-10 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20';

const labelClass = 'text-sm text-[#9CA3AF]';

export function PromoCreateModal({
  open,
  onOpenChange,
  editingPromo,
  onCreate,
  onUpdate,
}: PromoCreateModalProps) {
  const [code, setCode] = useState('');
  const [type, setType] = useState<PromoCodeType>('PERCENTAGE');
  const [value, setValue] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [minRideFare, setMinRideFare] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [perUserLimit, setPerUserLimit] = useState('1');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!editingPromo;

  useEffect(() => {
    if (editingPromo) {
      setCode(editingPromo.code);
      setType(editingPromo.type);
      setValue(editingPromo.value.toString());
      setMaxDiscount(editingPromo.maxDiscount?.toString() ?? '');
      setMinRideFare(editingPromo.minRideFare?.toString() ?? '');
      setUsageLimit(editingPromo.usageLimit?.toString() ?? '');
      setPerUserLimit(editingPromo.perUserLimit.toString());
      setValidFrom(editingPromo.validFrom.split('T')[0]);
      setValidUntil(editingPromo.validUntil.split('T')[0]);
      setDescription(editingPromo.description ?? '');
    } else {
      resetForm();
    }
  }, [editingPromo, open]);

  const resetForm = () => {
    setCode('');
    setType('PERCENTAGE');
    setValue('');
    setMaxDiscount('');
    setMinRideFare('');
    setUsageLimit('');
    setPerUserLimit('1');
    setValidFrom('');
    setValidUntil('');
    setDescription('');
  };

  const canSubmit = code.trim() && parseFloat(value) > 0 && validFrom && validUntil && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);

    const payload: CreatePromoPayload = {
      code: code.toUpperCase().trim(),
      type,
      value: parseFloat(value),
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
      minRideFare: minRideFare ? parseFloat(minRideFare) : null,
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      perUserLimit: parseInt(perUserLimit) || 1,
      validFrom: new Date(validFrom).toISOString(),
      validUntil: new Date(validUntil + 'T23:59:59').toISOString(),
      isActive: true,
      description: description.trim() || null,
    };

    try {
      if (isEditing && editingPromo) {
        await onUpdate(editingPromo.id, payload);
        toast.success(`Promo code ${payload.code} updated`);
      } else {
        await onCreate(payload);
        toast.success(`Promo code ${payload.code} created`);
      }
      onOpenChange(false);
      resetForm();
    } catch {
      toast.error(isEditing ? 'Failed to update promo code' : 'Failed to create promo code');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            {isEditing ? 'Edit Promo Code' : 'Create Promo Code'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Code */}
          <div className="space-y-2">
            <label className={labelClass}>Code *</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="WELCOME50"
              readOnly={isEditing}
              className={`${inputClass} uppercase ${isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          </div>

          {/* Type Toggle */}
          <div className="space-y-2">
            <label className={labelClass}>Type *</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('PERCENTAGE')}
                className={`flex-1 h-10 rounded-md text-sm font-medium transition-colors ${
                  type === 'PERCENTAGE'
                    ? 'bg-[#FACC15] text-black'
                    : 'border border-[#2A2A2A] bg-[#141414] text-[#9CA3AF] hover:text-white'
                }`}
              >
                Percentage
              </button>
              <button
                type="button"
                onClick={() => setType('FIXED_AMOUNT')}
                className={`flex-1 h-10 rounded-md text-sm font-medium transition-colors ${
                  type === 'FIXED_AMOUNT'
                    ? 'bg-[#FACC15] text-black'
                    : 'border border-[#2A2A2A] bg-[#141414] text-[#9CA3AF] hover:text-white'
                }`}
              >
                Fixed Amount
              </button>
            </div>
          </div>

          {/* Value + Max Discount */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className={labelClass}>Value *</label>
              <div className="relative">
                <input
                  type="number"
                  step={type === 'PERCENTAGE' ? '1' : '0.01'}
                  min="0"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6B7280]">
                  {type === 'PERCENTAGE' ? '%' : '€'}
                </span>
              </div>
            </div>
            {type === 'PERCENTAGE' && (
              <div className="space-y-2">
                <label className={labelClass}>Max Discount</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder="No limit"
                    className={inputClass}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6B7280]">€</span>
                </div>
              </div>
            )}
          </div>

          {/* Min Fare + Usage Limit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className={labelClass}>Min Ride Fare</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={minRideFare}
                  onChange={(e) => setMinRideFare(e.target.value)}
                  placeholder="No minimum"
                  className={inputClass}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6B7280]">€</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Usage Limit</label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  placeholder="Unlimited"
                  className={inputClass}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6B7280]">uses</span>
              </div>
            </div>
          </div>

          {/* Per User Limit */}
          <div className="space-y-2">
            <label className={labelClass}>Per User Limit</label>
            <input
              type="number"
              step="1"
              min="1"
              value={perUserLimit}
              onChange={(e) => setPerUserLimit(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className={labelClass}>Valid From *</label>
              <input
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Valid Until *</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={2}
              className={`${inputClass} h-auto py-2 resize-none`}
            />
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
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-[#FACC15] text-black hover:bg-[#E5B800] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              isEditing ? 'Update Code' : 'Create Code'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
