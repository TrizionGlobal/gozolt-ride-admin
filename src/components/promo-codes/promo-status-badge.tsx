'use client';

import { cn } from '@/lib/utils';
import { getPromoStatus } from '@/services/admin/promo.types';
import type { PromoCode } from '@/services/admin/promo.types';

interface PromoStatusBadgeProps {
  promo: PromoCode;
}

export function PromoStatusBadge({ promo }: PromoStatusBadgeProps) {
  const status = getPromoStatus(promo);
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        status.className,
      )}
    >
      {status.label}
    </span>
  );
}
