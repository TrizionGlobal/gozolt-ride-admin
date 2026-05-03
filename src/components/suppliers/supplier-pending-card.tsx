'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone, Hash, CreditCard, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SupplierDocumentsGrid } from './supplier-documents-grid';
import { useSupplierDocuments } from '@/hooks/use-suppliers';
import { TIER_DISPLAY } from '@/services/admin/supplier.types';
import type { SupplierListItem } from '@/services/admin/supplier.types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SupplierPendingCardProps {
  supplier: SupplierListItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function SupplierPendingCard({
  supplier,
  onApprove,
  onReject,
}: SupplierPendingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { documents, loading: docsLoading } = useSupplierDocuments(
    isExpanded ? supplier.id : null,
  );

  const tier = supplier.subscription?.tier;
  const hasStripe = !!supplier.stripeAccountId;

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] overflow-hidden">
      {/* Collapsed header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 hover:bg-[#1A1A1A]/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          {/* Company avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-yellow-900/30 border border-yellow-800/50">
            <Building2 className="h-5 w-5 text-[#FACC15]" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">{supplier.companyName}</p>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                <Mail className="h-3 w-3" />
                {supplier.email}
              </span>
              {supplier.contactPhone && (
                <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                  <Phone className="h-3 w-3" />
                  {supplier.contactPhone}
                </span>
              )}
              {supplier.vatNumber && (
                <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                  <Hash className="h-3 w-3" />
                  TM-2024-1102
                </span>
              )}
            </div>
          </div>
        </div>

        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-[#6B7280] shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[#6B7280] shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-[#2A2A2A] p-4 space-y-4">
          {docsLoading ? (
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 bg-[#1A1A1A]" />
              ))}
            </div>
          ) : (
            <SupplierDocumentsGrid documents={documents} />
          )}

          {/* Stripe status + Tier */}
          <div className="flex items-center gap-4 text-xs">
            <span
              className={cn(
                'flex items-center gap-1.5',
                hasStripe ? 'text-green-400' : 'text-red-400',
              )}
            >
              <CreditCard className="h-3.5 w-3.5" />
              {hasStripe ? 'Stripe Connected' : 'Stripe Not Connected'}
            </span>
            {tier && (
              <span className="text-[#6B7280]">
                Selected Tier: <span className="text-white">{TIER_DISPLAY[tier]}</span>
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => onApprove(supplier.id)}
              className="h-8 bg-green-600 text-white hover:bg-green-700 text-xs font-medium px-4"
            >
              <span className="mr-1">✓</span> Approve
            </Button>
            <Button
              onClick={() => onReject(supplier.id)}
              className="h-8 bg-red-600 text-white hover:bg-red-700 text-xs font-medium px-4"
            >
              <span className="mr-1">✕</span> Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info('Request More Info — feature coming soon')}
              className="h-8 border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B]/10 bg-transparent text-xs font-medium px-4"
            >
              <span className="mr-1">⚠</span> Request More Info
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
