'use client';

import { FileText, AlertTriangle } from 'lucide-react';
import { DocumentStatus } from '@/types';
import { SUPPLIER_DOCUMENT_TYPES } from '@/services/admin/supplier.types';
import type { SupplierDocument } from '@/services/admin/supplier.types';
import { cn } from '@/lib/utils';

interface SupplierDocumentsGridProps {
  documents: SupplierDocument[];
}

export function SupplierDocumentsGrid({ documents }: SupplierDocumentsGridProps) {
  return (
    <div>
      <h4 className="text-sm font-medium text-white mb-3">Document</h4>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SUPPLIER_DOCUMENT_TYPES.map(({ type, label }) => {
          const doc = documents.find((d) => d.type === type);
          const isMissing = !doc || (!doc.fileUrl && doc.status === DocumentStatus.PENDING);
          const isApproved = doc?.status === DocumentStatus.APPROVED;

          return (
            <div
              key={type}
              className={cn(
                'rounded-lg border p-3 flex flex-col gap-2',
                isMissing
                  ? 'border-red-800/50 bg-red-950/20'
                  : 'border-[#2A2A2A] bg-[#0A0A0A]',
              )}
            >
              <div className="flex items-center gap-2">
                <FileText
                  className={cn(
                    'h-5 w-5',
                    isMissing ? 'text-red-400' : isApproved ? 'text-green-400' : 'text-[#FACC15]',
                  )}
                />
              </div>
              <div>
                <p className="text-xs font-medium text-white leading-tight">{label}</p>
                {isMissing ? (
                  <span className="flex items-center gap-1 text-xs text-red-400 mt-1">
                    <AlertTriangle className="h-3 w-3" />
                    Missing
                  </span>
                ) : (
                  <button className="text-xs text-[#FACC15] hover:text-[#EAB308] mt-1 transition-colors">
                    View Full
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
