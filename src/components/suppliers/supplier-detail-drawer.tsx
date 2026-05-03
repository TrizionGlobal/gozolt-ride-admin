'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Coins,
  AlertTriangle,
  Building2,
  FileText,
  ArrowRight,
  Users,
  ExternalLink,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supplierService } from '@/services/admin/supplier.service';
import { STATUS_DISPLAY, TIER_DISPLAY } from '@/services/admin/supplier.types';
import type { SupplierDetail } from '@/services/admin/supplier.types';
import { toast } from 'sonner';

interface SupplierDetailDrawerProps {
  supplierId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupplierDetailDrawer({ supplierId, open, onOpenChange }: SupplierDetailDrawerProps) {
  const [supplier, setSupplier] = useState<SupplierDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supplierId && open) {
      setLoading(true);
      supplierService
        .getSupplierDetail(supplierId)
        .then(setSupplier)
        .catch(() => toast.error('Failed to load supplier details'))
        .finally(() => setLoading(false));
    } else {
      setSupplier(null);
    }
  }, [supplierId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-[#2A2A2A] text-white sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white text-lg flex items-center gap-3">
            <Building2 className="h-5 w-5 text-[#FACC15]" />
            {loading ? 'Loading...' : supplier?.companyName ?? 'Supplier'}
          </DialogTitle>
          <DialogDescription className="text-[#6B7280]">
            {supplier ? (
              <span className="flex items-center gap-3 flex-wrap">
                <span>{supplier.email}</span>
                <span className="text-[#FACC15]">{supplier.subscription ? TIER_DISPLAY[supplier.subscription.tier] : '---'}</span>
                <span>{STATUS_DISPLAY[supplier.status]}</span>
              </span>
            ) : (
              'Loading supplier details...'
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          {loading && (
            <div className="flex items-center justify-center py-12 text-[#6B7280] text-sm">
              Loading...
            </div>
          )}

          {!loading && supplier && (
            <>
              {/* Revenue Summary Card */}
              {supplier.revenueSummary && (
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#FACC15]" />
                      <h4 className="text-sm font-medium text-white">Revenue Summary</h4>
                    </div>
                    <Link
                      href={`/invoices?supplier=${supplier.id}`}
                      className="inline-flex items-center gap-1 text-xs text-[#FACC15] hover:text-[#FDE68A] transition-colors"
                    >
                      <FileText className="h-3 w-3" />
                      View Invoices
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#9CA3AF]">Ride Revenue</span>
                      <span className="text-sm text-white font-medium">&euro;{supplier.revenueSummary.totalRideRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#9CA3AF]">Platform Commission</span>
                      <span className="text-sm text-red-400">-&euro;{supplier.revenueSummary.platformCommission.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-[#2A2A2A] my-1" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#9CA3AF]">Net Earnings</span>
                      <span className="text-sm text-white font-medium">&euro;{supplier.revenueSummary.supplierEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#9CA3AF]">Tip Pass-Through</span>
                      <span className="text-sm text-[#FACC15]">&euro;{supplier.revenueSummary.tipPassThrough.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-[#2A2A2A] my-1" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#9CA3AF]">Total Paid</span>
                      <span className="text-sm text-green-400">&euro;{supplier.revenueSummary.totalPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#9CA3AF]">Outstanding</span>
                      <span className={`text-sm font-medium ${supplier.revenueSummary.outstanding > 0 ? 'text-amber-400' : 'text-green-400'}`}>
                        &euro;{supplier.revenueSummary.outstanding.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tip Pass-Through Card */}
              {supplier.tipSummary && (
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Coins className="h-4 w-4 text-[#FACC15]" />
                    <h4 className="text-sm font-medium text-white">Tip Pass-Through</h4>
                    {supplier.tipSummary.pendingForwarding > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <AlertTriangle className="h-3 w-3" />
                        Pending Forwarding
                      </span>
                    )}
                  </div>

                  {/* Tip stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-3 text-center">
                      <p className="text-lg font-semibold text-white">&euro;{supplier.tipSummary.totalTipsReceived.toLocaleString()}</p>
                      <p className="text-xs text-[#6B7280]">Total Received</p>
                    </div>
                    <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-3 text-center">
                      <p className="text-lg font-semibold text-green-400">&euro;{supplier.tipSummary.totalTipsForwarded.toLocaleString()}</p>
                      <p className="text-xs text-[#6B7280]">Forwarded</p>
                    </div>
                    <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-3 text-center">
                      <p className={`text-lg font-semibold ${supplier.tipSummary.pendingForwarding > 0 ? 'text-amber-400' : 'text-green-400'}`}>
                        &euro;{supplier.tipSummary.pendingForwarding.toLocaleString()}
                      </p>
                      <p className="text-xs text-[#6B7280]">Pending</p>
                    </div>
                  </div>

                  {/* Driver breakdown table */}
                  {supplier.tipSummary.driverBreakdown.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-3.5 w-3.5 text-[#6B7280]" />
                        <p className="text-xs text-[#6B7280] font-medium">Driver Breakdown</p>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b border-[#2A2A2A] hover:bg-transparent">
                            <TableHead className="text-[#9CA3AF] text-xs font-medium">Driver</TableHead>
                            <TableHead className="text-[#9CA3AF] text-xs font-medium">Driver ID</TableHead>
                            <TableHead className="text-[#9CA3AF] text-xs font-medium text-right">Tips Owed</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {supplier.tipSummary.driverBreakdown.map((driver) => (
                            <TableRow key={driver.driverId} className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50">
                              <TableCell className="text-xs text-white">{driver.name}</TableCell>
                              <TableCell className="text-xs text-[#9CA3AF] font-mono">{driver.driverId}</TableCell>
                              <TableCell className="text-xs text-amber-400 font-medium text-right">
                                &euro;{driver.tipsOwed.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
