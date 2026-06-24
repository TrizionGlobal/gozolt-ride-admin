'use client';

import {
  User,
  Car,
  Building2,
  CreditCard,
  Clock,
  Star,
} from 'lucide-react';
import type { RideDetail } from '@/services/admin/ride.types';

interface RideInfoPanelProps {
  detail: RideDetail;
}

function FareRow({ label, value, bold, green, badge }: { label: string; value: number | null; bold?: boolean; green?: boolean; badge?: string }) {
  return (
    <div className={`flex justify-between px-3 py-1.5 border-b border-[#2A2A2A] last:border-0 ${bold ? 'bg-[#141414]' : ''}`}>
      <span className={green ? 'text-green-400' : bold ? 'font-semibold text-white' : 'text-[#9CA3AF]'}>{label}</span>
      {value != null ? (
        <span className={green ? 'font-semibold text-green-400' : bold ? 'font-semibold text-white' : 'text-white'}>€{Number(value).toFixed(2)}</span>
      ) : badge ? (
        <span className="text-yellow-400 font-medium">{badge}</span>
      ) : null}
    </div>
  );
}

export function RideInfoPanel({ detail }: RideInfoPanelProps) {
  const passengerName = [detail.user.firstName, detail.user.lastName]
    .filter(Boolean)
    .join(' ') || 'Unknown';
  const driverName = detail.driver
    ? `${detail.driver.firstName} ${detail.driver.lastName}`
    : '—';
  const supplierName = detail._supplierName ?? '—';
  const duration = detail.durationMinutes ? `${detail.durationMinutes} min` : '—';
  const avgRating = detail.ratings.length > 0
    ? Number(detail.ratings.reduce((sum, r) => sum + r.rating, 0) / detail.ratings.length).toFixed(1)
    : '—';

  const rows: { icon: React.ElementType; label: string; value: string }[] = [
    { icon: User, label: 'Passenger', value: passengerName },
    { icon: Car, label: 'Driver', value: driverName },
    { icon: Building2, label: 'Supplier', value: supplierName },
    { icon: CreditCard, label: 'Payment', value: detail.paymentMethod === 'CARD' ? 'Card' : detail.paymentMethod === 'CASH' ? 'Cash' : 'Wallet' },
    { icon: Clock, label: 'Duration', value: duration },
    { icon: Star, label: 'Rating', value: avgRating !== '—' ? `${avgRating} ★` : '—' },
    ...(detail.riderRatings?.length > 0 ? [{
      icon: Star, label: 'Rider Rating', value: `${detail.riderRatings[0].rating} ★`
    }] : []),
  ];

  return (
    <div>
      <p className="text-sm font-medium text-white mb-3">Timeline</p>
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] overflow-hidden">
        {rows.map((row, i) => {
          const Icon = row.icon;
          return (
            <div
              key={`${row.label}-${i}`}
              className={`flex items-center justify-between px-3 py-2.5 ${
                i < rows.length - 1 ? 'border-b border-[#2A2A2A]' : ''
              }`}
            >
              <div className="flex items-center gap-2 text-[#9CA3AF]">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-sm">{row.label}</span>
              </div>
              <span className="text-sm font-medium text-white">{row.value}</span>
            </div>
          );
        })}
      </div>

      {/* Fare Breakdown Card */}
      <div className="mt-3">
        <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">Fare Breakdown</p>
        <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] overflow-hidden text-xs">
          {detail.baseFare != null && <FareRow label="Base Fare" value={detail.baseFare} />}
          {detail.distanceFare != null && <FareRow label={`Distance (${detail.distanceKm?.toFixed(1) ?? '?'} km)`} value={detail.distanceFare} />}
          {detail.timeFare != null && <FareRow label={`Time (${detail.durationMinutes ?? '?'} min)`} value={detail.timeFare} />}
          {(detail.waitTimeFee ?? 0) > 0 && <FareRow label="Wait Time" value={detail.waitTimeFee!} />}
          {(detail.bookingFee ?? 0) > 0 && <FareRow label="Booking Fee" value={detail.bookingFee!} />}
          {detail.surgeMultiplier > 1 && <FareRow label={`Surge ×${detail.surgeMultiplier}`} value={null} badge={`${detail.surgeMultiplier}x`} />}
          <FareRow label="Total Fare" value={detail.actualFare ?? detail.estimatedFare} bold />
          {detail.tip && <FareRow label="Tip" value={detail.tip.amount} green />}
        </div>
      </div>
    </div>
  );
}
