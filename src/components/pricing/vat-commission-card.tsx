'use client';

import { useState, useEffect } from 'react';
import { Pencil, X, Save, Percent, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pricingService } from '@/services/admin/pricing.service';
import { toast } from 'sonner';

export function VatCommissionCard() {
  const [vatRate, setVatRate] = useState<number>(10.0);
  const [commissionRate, setCommissionRate] = useState<number>(9.0);
  const [isEditing, setIsEditing] = useState(false);
  const [vatInputValue, setVatInputValue] = useState<string>('10.00');
  const [commissionInputValue, setCommissionInputValue] = useState<string>('9.00');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    pricingService
      .getVatSettings()
      .then((data) => {
        if (mounted) {
          if (data?.vatPercentage !== undefined) {
            const vRate = Number(data.vatPercentage);
            setVatRate(vRate);
            setVatInputValue(vRate.toFixed(2));
          }
          if (data?.commissionPercentage !== undefined) {
            const cRate = Number(data.commissionPercentage);
            setCommissionRate(cRate);
            setCommissionInputValue(cRate.toFixed(2));
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load VAT/Commission settings:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleEdit = () => {
    setVatInputValue(vatRate.toFixed(2));
    setCommissionInputValue(commissionRate.toFixed(2));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setVatInputValue(vatRate.toFixed(2));
    setCommissionInputValue(commissionRate.toFixed(2));
    setIsEditing(false);
  };

  const handleSave = async () => {
    const vatNum = parseFloat(vatInputValue);
    if (isNaN(vatNum) || vatNum < 0 || vatNum > 100) {
      toast.error('VAT percentage must be between 0% and 100%');
      return;
    }

    const commissionNum = parseFloat(commissionInputValue);
    if (isNaN(commissionNum) || commissionNum < 0 || commissionNum > 100) {
      toast.error('Cab commission percentage must be between 0% and 100%');
      return;
    }

    setSaving(true);
    try {
      const res = await pricingService.updateVatSettings(vatNum, commissionNum);
      const updatedVat = Number(res?.vatPercentage ?? vatNum);
      const updatedCommission = Number(res?.commissionPercentage ?? commissionNum);
      setVatRate(updatedVat);
      setCommissionRate(updatedCommission);
      setVatInputValue(updatedVat.toFixed(2));
      setCommissionInputValue(updatedCommission.toFixed(2));
      setIsEditing(false);
      toast.success('VAT and Commission percentages updated successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update settings');
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
            Configure platform VAT rate across all services and dynamic cab commission rate for suppliers on the commission model
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
      <div className="space-y-3">
        {/* VAT Commission Rate */}
        <div className="flex items-center justify-between py-3 px-3.5 rounded-lg bg-[#1A1A1A] border border-[#27272A]">
          <div>
            <span className="text-sm font-medium text-white block">
              VAT Commission Rate (All Services)
            </span>
            <span className="text-xs text-[#6B7280]">
              Charged on booking subtotal (Cabs, Car Rentals, Bike Rentals, Airport Transfers) and deposited into Admin Stripe account
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
                  value={vatInputValue}
                  onChange={(e) => setVatInputValue(e.target.value)}
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

        {/* Cab Commission Rate */}
        <div className="flex items-center justify-between py-3 px-3.5 rounded-lg bg-[#1A1A1A] border border-[#27272A]">
          <div>
            <span className="text-sm font-medium text-white block">
              Cab Commission Rate (Commission Model)
            </span>
            <span className="text-xs text-[#6B7280]">
              Deducted during 9-day settlement from Total Amount Paid by Customer (Ride Fare + VAT) when supplier is on Commission Model
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
                  value={commissionInputValue}
                  onChange={(e) => setCommissionInputValue(e.target.value)}
                  className="w-24 px-2 py-1 bg-[#141414] border border-[#FACC15] rounded text-white text-sm text-right focus:outline-none"
                />
                <span className="text-sm font-bold text-[#FACC15]">%</span>
              </div>
            ) : (
              <span className="text-base font-bold text-[#FACC15]">
                {loading ? '...' : `${commissionRate.toFixed(2)} %`}
              </span>
            )}
          </div>
        </div>

        {/* Notice Info Box */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FACC15]/5 border border-[#FACC15]/20 text-xs text-[#D1D5DB]">
          <Info className="h-4 w-4 text-[#FACC15] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-white">Platform Revenue & Settlement Rules</p>
            <p className="text-[#9CA3AF] leading-relaxed">
              • <strong className="text-white">Platform VAT:</strong> Automatically excluded from supplier ride fare earnings and withheld by Gozolt Admin.<br />
              • <strong className="text-white">Cab Commission:</strong> When a supplier chooses the Commission Model (€0/mo), the platform deducts this percentage from the <span className="text-white font-medium">Total Amount Paid by Customer</span> (Fare + VAT) during the 9-day settlement. Suppliers on a Subscription Plan pay 0% platform commission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

