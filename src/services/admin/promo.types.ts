// --- Promo code types ---
export type PromoCodeType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface PromoCode {
  id: string;
  code: string;
  type: PromoCodeType;
  value: number;
  maxDiscount: number | null;
  minRideFare: number | null;
  usageLimit: number | null;
  usedCount: number;
  perUserLimit: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  description: string | null;
  createdAt: string;
}

// --- Create DTO ---
export interface CreatePromoPayload {
  code: string;
  type: PromoCodeType;
  value: number;
  maxDiscount: number | null;
  minRideFare: number | null;
  usageLimit: number | null;
  perUserLimit: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  description: string | null;
}

// --- Display helpers ---
export const PROMO_TYPE_DISPLAY: Record<PromoCodeType, { label: string; className: string }> = {
  PERCENTAGE: { label: 'Percentage', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  FIXED_AMOUNT: { label: 'Fixed', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
};

export interface PromoStatusDisplay {
  label: string;
  className: string;
}

export function getPromoStatus(promo: PromoCode): PromoStatusDisplay {
  if (!promo.isActive) return { label: 'Disabled', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  if (new Date(promo.validUntil) < new Date()) return { label: 'Expired', className: 'bg-red-500/20 text-red-400 border-red-500/30' };
  if (promo.usageLimit && promo.usedCount >= promo.usageLimit) return { label: 'Maxed', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
  return { label: 'Active', className: 'bg-green-500/20 text-green-400 border-green-500/30' };
}
