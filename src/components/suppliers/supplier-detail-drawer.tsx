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
  CreditCard,
  Car,
  Download,
  Calendar,
  Eye,
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
import { STATUS_DISPLAY, TIER_DISPLAY, SUPPLIER_DOCUMENT_TYPES } from '@/services/admin/supplier.types';
import type { SupplierDetail, SupplierDocument } from '@/services/admin/supplier.types';
import { toast } from 'sonner';

interface SupplierDetailDrawerProps {
  supplierId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupplierDetailDrawer({ supplierId, open, onOpenChange }: SupplierDetailDrawerProps) {
  const [supplier, setSupplier] = useState<SupplierDetail | null>(null);
  const [documents, setDocuments] = useState<SupplierDocument[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supplierId && open) {
      setLoading(true);
      Promise.all([
        supplierService.getSupplierDetail(supplierId),
        supplierService.getSupplierDocuments(supplierId)
      ])
        .then(([sup, docs]) => {
          setSupplier(sup);
          setDocuments(docs);
        })
        .catch(() => toast.error('Failed to load supplier details'))
        .finally(() => setLoading(false));
    } else {
      setSupplier(null);
      setDocuments([]);
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
              {/* Documents Card */}
              <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-4 w-4 text-[#FACC15]" />
                  <h4 className="text-sm font-medium text-white">Uploaded Documents</h4>
                </div>
                {(() => {
                  const companyDocs = (documents || []).filter(doc => SUPPLIER_DOCUMENT_TYPES.some(t => t.type === doc.type));
                  return companyDocs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {companyDocs.map((doc) => {
                        const typeLabel = SUPPLIER_DOCUMENT_TYPES.find(t => t.type === doc.type)?.label || doc.type;
                        return (
                          <div key={doc.id} className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-3 flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-white">{typeLabel}</p>
                              <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-1">{doc.fileName || 'Document'}</p>
                            </div>
                            {doc.fileUrl && (
                              <Link href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded text-[#D4D4D8] transition-colors text-xs font-medium">
                                <Eye className="h-3.5 w-3.5" />
                                View
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-[#6B7280]">No documents uploaded.</p>
                  );
                })()}
              </div>

              {/* Bank Details Card */}
              <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-4 w-4 text-[#FACC15]" />
                  <h4 className="text-sm font-medium text-white">Bank Details</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#6B7280]">Bank Name</p>
                    <p className="text-sm text-white font-medium">{supplier.supplierBankName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Account Holder</p>
                    <p className="text-sm text-white font-medium">{supplier.supplierAccountHolder || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Account Number / IBAN</p>
                    <p className="text-sm text-white font-medium">{supplier.supplierAccountNumber || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">SWIFT / BIC Code</p>
                    <p className="text-sm text-white font-medium">{supplier.supplierSwiftCode || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Subscription Details Card */}
              {supplier.subscription && (
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-[#FACC15]" />
                    <h4 className="text-sm font-medium text-white">Subscription Details</h4>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-3">
                      <p className="text-xs text-[#6B7280] mb-1">Plan Tier</p>
                      <p className="text-sm font-bold text-[#FACC15]">{TIER_DISPLAY[supplier.subscription.tier]}</p>
                    </div>
                    <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-3">
                      <p className="text-xs text-[#6B7280] mb-1">Status</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        supplier.subscription.stripeSubId ? 'bg-green-500/20 text-green-400' : 'bg-[#2A2A2A] text-[#9CA3AF] border border-[#3A3A3A]'
                      }`}>
                        {supplier.subscription.stripeSubId ? 'Active' : 'Not Subscribed'}
                      </span>
                    </div>
                    <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-3">
                      <p className="text-xs text-[#6B7280] mb-1">Expiration</p>
                      <p className="text-sm font-medium text-white">
                        {supplier.subscription.currentPeriodEnd 
                          ? new Date(supplier.subscription.currentPeriodEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                          : '—'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-3">
                      <p className="text-xs text-[#6B7280] mb-1">Vehicles Limit</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-white">{supplier._count?.vehicles ?? 0}</span>
                        <span className="text-sm text-[#9CA3AF]">/ {supplier.subscription.maxVehicles}</span>
                      </div>
                    </div>
                    <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-3">
                      <p className="text-xs text-[#6B7280] mb-1">Drivers Limit</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-white">{supplier._count?.drivers ?? 0}</span>
                        <span className="text-sm text-[#9CA3AF]">/ {supplier.subscription.maxDrivers}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Vehicle Type Breakdown Card */}
              {supplier.vehicleTypeCounts && supplier.vehicleTypeCounts.length > 0 && (
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Car className="h-4 w-4 text-[#FACC15]" />
                    <h4 className="text-sm font-medium text-white">Vehicle Breakdown</h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {supplier.vehicleTypeCounts.map(v => (
                      <div key={v.type} className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">{v.count}</p>
                        <p className="text-xs text-[#6B7280] capitalize">{v.type.toLowerCase().replace('_', ' ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
