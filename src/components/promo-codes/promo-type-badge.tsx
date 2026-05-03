'use client';

import { cn } from '@/lib/utils';
import { PROMO_TYPE_DISPLAY } from '@/services/admin/promo.types';
import type { PromoCodeType } from '@/services/admin/promo.types';

interface PromoTypeBadgeProps {
  type: PromoCodeType;
}

export function PromoTypeBadge({ type }: PromoTypeBadgeProps) {
  const display = PROMO_TYPE_DISPLAY[type];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        display.className,
      )}
    >
      {display.label}
    </span>
  );
}
