'use client';

import Link from 'next/link';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface KpiCardProps {
  label: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  prefix?: string;
  isLoading?: boolean;
  href?: string;
}

export function KpiCard({ label, value, change, icon: Icon, prefix, isLoading, href }: KpiCardProps) {
  const isPositive = change !== undefined && change >= 0;

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-9 w-9 rounded-md bg-[#2A2A2A]" />
          <Skeleton className="h-5 w-14 rounded-full bg-[#2A2A2A]" />
        </div>
        <Skeleton className="h-8 w-20 mb-1 bg-[#2A2A2A]" />
        <Skeleton className="h-4 w-24 bg-[#2A2A2A]" />
      </div>
    );
  }

  const cardContent = (
    <>
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FACC15]" />
      <div className="flex items-center justify-between mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1A1A1A]">
          <Icon className="h-5 w-5 text-[#FACC15]" />
        </div>
        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              isPositive
                ? 'bg-[#22C55E]/10 text-[#22C55E]'
                : 'bg-[#EF4444]/10 text-[#EF4444]'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? '+' : ''}
            {change}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white">
        {prefix}
        {value}
      </p>
      <p className="text-xs text-[#6B7280] mt-0.5">{label}</p>
    </>
  );

  const baseClass = 'rounded-lg border border-[#2A2A2A] bg-[#141414] p-4 relative overflow-hidden';

  if (href) {
    return (
      <Link href={href} className={`block ${baseClass} hover:border-[#FACC15]/30 cursor-pointer transition-colors`}>
        {cardContent}
      </Link>
    );
  }

  return <div className={baseClass}>{cardContent}</div>;
}
