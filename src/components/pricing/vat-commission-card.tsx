'use client';

import { useState, useEffect } from 'react';
import { Pencil, X, Save, Percent, ShieldCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pricingService } from '@/services/admin/pricing.service';
import { toast } from 'sonner';

export function VatCommissionCard() {
  const [vatRate, setVatRate] = useState<number>(10.0);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState<string>('10.00');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    pricingService
      .getVatSettings()
      .then((data) => {
        if (mounted && data?.vatPercentage !== undefined) {
          const rate = Number(data.vatPercentage);
          setVatRate(rate);
          setInputValue(rate.toFixed(2));
        }
      })
      .catch((err) => {
        console.error('Failed to load VAT settings:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleEdit = () => {
    setInputValue(vatRate.toFixed(2));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setInputValue(vatRate.toFixed(2));
    setIsEditing(false);
  };

  const handleSave = async () => {
    const num = parseFloat(inputValue);
    if (isNaN(num) || num < 0 || num > 100) {
      toast.error('VAT percentage must be between 0% and 100%');
      return;
    }

    setSaving(true);
    try {
      const res = await pricingService.updateVatSettings(num);
      const updatedRate = Number(res?.vatPercentage ?? num);
      setVatRate(updatedRate);
      setInputValue(updatedRate.toFixed(2));
      setIsEditing(false);
      toast.success('VAT Commission percentage updated successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update VAT rate');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border-2 border-dashed border-[#FACC15]/60 bg-[#141414] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-[#FACC15]" />
            <h3 className="text-base font-semibold text-white">
              Platform VAT & Commission (All Services)
            </h3>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Decide the VAT percentage commission applied to Cabs, Car Rentals, Bike Rentals, and Airport Transfers
          </p>
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
            disabled={loading}
            className="h-8 text-xs bg-[#FACC15] text-black hover:bg-[#E5B800]"
          >
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 px-3.5 rounded-lg bg-[#1A1A1A] border border-[#27272A]">
          <div>
            <span className="text-sm font-medium text-white block">
              VAT Commission Rate
            </span>
            <span className="text-xs text-[#6B7280]">
              Charged on booking subtotal and deposited into Admin Stripe account
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-24 px-2 py-1 bg-[#141414] border border-[#FACC15] rounded text-white text-sm text-right focus:outline-none"
                  autoFocus
                />
                <span className="text-sm font-bold text-[#FACC15]">%</span>
              </div>
            ) : (
              <span className="text-base font-bold text-[#FACC15]">
                {loading ? '...' : `${vatRate.toFixed(2)} %`}
              </span>
            )}
          </div>
        </div>

        {/* Notice Info Box */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FACC15]/5 border border-[#FACC15]/20 text-xs text-[#D1D5DB]">
          <Info className="h-4 w-4 text-[#FACC15] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-white">Platform Revenue Rule</p>
            <p className="text-[#9CA3AF] leading-relaxed">
              The VAT amount is complete platform commission for Gozolt Admin. It is automatically excluded from supplier fare earnings and 9-day settlement payouts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

