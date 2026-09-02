'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { paymentService } from '@/services/admin/payment.service';
import { useSuppliers } from '@/hooks/use-suppliers';
import type { SettledBalanceResponse } from '@/services/admin/payment.types';
import { toast } from 'sonner';

interface ProcessPayoutsViewProps {
  onClose: () => void;
  onSuccess: () => void;
  preselectedSupplierId?: string;
  module?: 'CAB' | 'RENTAL' | 'BIKE_RENTAL' | 'GLOBAL';
}

export function ProcessPayoutsView({
  onClose,
  onSuccess,
  preselectedSupplierId,
  module = 'CAB',
}: ProcessPayoutsViewProps) {
  const [supplierId, setSupplierId] = useState(preselectedSupplierId || '');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [balance, setBalance] = useState<SettledBalanceResponse | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [receipt, setReceipt] = useState<{
    amountSent: number;
    supplierName: string;
    supplierBankName: string | null;
    supplierAccountHolder: string | null;
    supplierAccountNumber: string | null;
    totalCashCollected: number;
    remainingPendingAfterThis: number;
    datePaid: string;
  } | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  const { data: supplierData, loading: loadingSuppliers } = useSuppliers({ limit: 100 }, true);
  const suppliers = supplierData?.data ?? [];

  const selectedSupplier = suppliers.find((s) => s.id === supplierId);
  const numAmount = parseFloat(amount) || 0;
  const canSubmit = supplierId && numAmount > 0 && !submitting;

  useEffect(() => {
    if (!receipt && !errorDetails) {
      if (preselectedSupplierId) {
        setSupplierId(preselectedSupplierId);
      }
    }
  }, [preselectedSupplierId, receipt, errorDetails]);

  useEffect(() => {
    if (balance && !isCustomAmount) {
      // Always reset amount back to default when toggling off customization
      setAmount((balance.availableToPayout || 0) > 0 ? (balance.availableToPayout || 0).toFixed(2) : '');
    }
  }, [isCustomAmount, balance]);

  useEffect(() => {
    if (!supplierId) {
      setBalance(null);
      setAmount('');
      setIsCustomAmount(false);
      return;
    }
    const fetchBalance = async () => {
      setLoadingBalance(true);
      try {
        const bal = await paymentService.getSettledBalance(supplierId, module);
        setBalance(bal);
        setAmount((bal.availableToPayout || 0).toString());
      } catch {
        toast.error('Failed to load settled balance for this supplier.');
      } finally {
        setLoadingBalance(false);
      }
    };
    fetchBalance();
  }, [supplierId, module]);

  const handleConfirm = async () => {
    if (!canSubmit || !selectedSupplier) return;
    setSubmitting(true);
    try {
      await paymentService.triggerPayout({
        supplierId,
        supplierName: selectedSupplier.companyName,
        amount: numAmount,
        module,
      });

      const newBal = await paymentService.getSettledBalance(supplierId, module);
      setReceipt({
        amountSent: numAmount,
        supplierName: selectedSupplier.companyName,
        supplierBankName: newBal.supplierBankName,
        supplierAccountHolder: newBal.supplierAccountHolder,
        supplierAccountNumber: newBal.supplierAccountNumber,
        totalCashCollected: balance?.totalCashCollected || 0,
        remainingPendingAfterThis: Math.max(0, (newBal.totalPendingBalance || 0) - (newBal.availableToPayout || 0)),
        datePaid: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      });
      onSuccess();
    } catch (err: any) {
      setErrorDetails(err.response?.data?.message || 'Failed to process payout. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNotifySupplier = async () => {
    if (!supplierId) return;
    try {
      setIsNotifying(true);
      await paymentService.notifySupplierBankDetails(supplierId);
      toast.success('Notification email sent successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to send notification email');
    } finally {
      setIsNotifying(false);
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-white min-h-[60vh] flex flex-col">
      <div className="flex items-center mb-6 space-x-3">
        <Button variant="ghost" onClick={onClose} className="p-2 text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A]">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold text-white">
          {receipt ? 'Payment Successful' : errorDetails ? 'Payment Failed' : 'Process 9-Day Settlement'}
        </h2>
      </div>

      <div className="flex-1 bg-[#141414] border border-[#2A2A2A] rounded-xl p-6">
        {receipt ? (
          <div className="space-y-6 flex flex-col items-center justify-center py-10 max-w-md mx-auto">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 border-2 border-green-500/30">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white">€{receipt.amountSent.toFixed(2)}</p>
              <p className="text-base text-[#9CA3AF] mt-2">Successfully sent to supplier</p>
            </div>
            <div className="w-full bg-[#1A1A1A] p-5 rounded-xl border border-[#2A2A2A] space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#9CA3AF]">Supplier</span>
                <span className="text-white font-semibold">{receipt.supplierName}</span>
              </div>
              {receipt.supplierAccountHolder && (
                <div className="flex justify-between items-center">
                  <span className="text-[#9CA3AF]">Account Holder</span>
                  <span className="text-white">{receipt.supplierAccountHolder}</span>
                </div>
              )}
              {receipt.supplierBankName && (
                <div className="flex justify-between items-center">
                  <span className="text-[#9CA3AF]">Bank</span>
                  <span className="text-white">{receipt.supplierBankName}</span>
                </div>
              )}
              {receipt.supplierAccountNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-[#9CA3AF]">IBAN</span>
                  <span className="text-white font-mono text-sm">{receipt.supplierAccountNumber}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[#9CA3AF]">Date Paid</span>
                <span className="text-white">{receipt.datePaid}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-[#2A2A2A]">
                <span className="text-[#9CA3AF]">Remaining Balance</span>
                <span className="text-[#FACC15] font-bold">€{receipt.remainingPendingAfterThis.toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={onClose}
              className="w-full bg-[#FACC15] hover:bg-[#E5B800] text-black font-bold h-12 text-lg"
            >
              Ok
            </Button>
          </div>
        ) : errorDetails ? (
          errorDetails === 'Supplier has not connected a Stripe account for payouts.' ? (
            <div className="space-y-6 flex flex-col items-center justify-center py-10 max-w-md mx-auto">
              <AlertTriangle className="h-20 w-20 text-yellow-500 mb-2" />
              <p className="text-2xl font-bold text-white text-center">Missing Bank Details</p>
              <div className="w-full bg-[#1A1A1A] p-5 rounded-lg border border-[#2A2A2A] space-y-4 text-sm">
                <p className="text-[#9CA3AF] text-center text-base">The supplier has not yet added their bank account details.</p>
                <div className="flex flex-col space-y-3 pt-4 border-t border-[#2A2A2A]">
                  <div className="flex justify-between text-base">
                    <span className="text-[#9CA3AF]">Supplier Name:</span>
                    <span className="text-white font-medium">{selectedSupplier?.companyName}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-[#9CA3AF]">Email:</span>
                    <span className="text-white font-medium truncate max-w-[250px]" title={selectedSupplier?.email}>{selectedSupplier?.email}</span>
                  </div>
                </div>
              </div>
              <div className="w-full flex space-x-4 mt-6">
                <Button
                  onClick={onClose}
                  className="flex-1 bg-[#374151] hover:bg-[#4B5563] text-white h-12 text-base"
                >
                  Close
                </Button>
                <Button
                  onClick={handleNotifySupplier}
                  disabled={isNotifying}
                  className="flex-1 bg-[#FACC15] hover:bg-[#FACC15]/90 text-black font-bold h-12 text-base"
                >
                  {isNotifying ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Notifying...</>
                  ) : (
                    'Notify Supplier'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 flex flex-col items-center justify-center py-10 max-w-md mx-auto">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10 border-2 border-red-500/30">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">Payout Failed</p>
                <p className="text-sm text-[#9CA3AF] mt-2">The payment could not be processed</p>
              </div>
              <div className="w-full bg-[#1A1A1A] p-5 rounded-xl border border-[#2A2A2A] space-y-4 text-sm">
                <div className="flex justify-between text-base">
                  <span className="text-[#9CA3AF]">Supplier</span>
                  <span className="text-white font-medium">{selectedSupplier?.companyName}</span>
                </div>
                <div className="pt-3 border-t border-[#2A2A2A]">
                  <span className="text-[#9CA3AF] block mb-2 text-base">Reason</span>
                  <span className="text-red-400 text-base">{errorDetails}</span>
                </div>
              </div>
              <Button
                onClick={onClose}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 text-lg"
              >
                Close
              </Button>
            </div>
          )
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">


            {loadingBalance ? (
              <div className="space-y-6 animate-pulse">
                {/* Main Balance Skeleton */}
                <div className="p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-4 bg-[#2A2A2A] rounded w-1/3"></div>
                      <div className="h-4 bg-[#2A2A2A] rounded w-1/4"></div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center border-t border-[#2A2A2A] pt-3">
                    <div className="h-5 bg-[#2A2A2A] rounded w-1/4"></div>
                    <div className="h-6 bg-[#2A2A2A] rounded w-1/5"></div>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#2A2A2A] pt-3 mt-3">
                    <div className="h-4 bg-[#2A2A2A] rounded w-1/3"></div>
                    <div className="h-5 bg-[#2A2A2A] rounded w-1/5"></div>
                  </div>
                </div>

                {module === 'GLOBAL' && (
                  <div className="mt-2">
                    <div className="h-6 bg-[#2A2A2A] rounded w-48 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg space-y-3">
                          <div className="h-4 bg-[#2A2A2A] rounded w-1/2 mb-2"></div>
                          {[1, 2, 3].map((j) => (
                            <div key={j} className="flex justify-between items-center">
                              <div className="h-3 bg-[#2A2A2A] rounded w-1/3"></div>
                              <div className="h-3 bg-[#2A2A2A] rounded w-1/4"></div>
                            </div>
                          ))}
                          <div className="flex justify-between items-center border-t border-[#2A2A2A] pt-2 mt-2">
                            <div className="h-4 bg-[#2A2A2A] rounded w-1/2"></div>
                            <div className="h-4 bg-[#2A2A2A] rounded w-1/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input and Buttons Skeleton */}
                <div className="space-y-3 mt-6">
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-[#2A2A2A] rounded w-32"></div>
                  </div>
                  <div className="w-full h-14 bg-[#1A1A1A] border-2 border-[#2A2A2A] rounded-xl"></div>
                </div>

                <div className="flex gap-4 pt-4 mt-6">
                  <div className="flex-1 h-14 bg-[#2A2A2A] rounded-md"></div>
                  <div className="flex-1 h-14 bg-[#2A2A2A] rounded-md"></div>
                </div>
              </div>
            ) : balance ? (
              <div className="space-y-6">
                {/* Unified Supplier Details */}
                <div className="p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg">
                  <div className="flex justify-between items-start border-b border-[#2A2A2A] pb-4 mb-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-lg font-bold text-white">{selectedSupplier?.companyName}</span>
                      <span className="text-sm text-[#9CA3AF]">{selectedSupplier?.email}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-sm text-[#9CA3AF]">Phone</span>
                      <span className="text-white font-medium">{selectedSupplier?.contactPhone || 'N/A'}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-[#A1A1AA] uppercase tracking-wider mb-4">Account Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-[#9CA3AF] uppercase tracking-wider block">Bank Name</span>
                      <span className="text-sm text-white font-medium">{balance.supplierBankName || 'N/A'}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-[#9CA3AF] uppercase tracking-wider block">Account Holder</span>
                      <span className="text-sm text-white font-medium">{balance.supplierAccountHolder || 'N/A'}</span>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <span className="text-xs text-[#9CA3AF] uppercase tracking-wider block">Account Number / IBAN</span>
                      <span className="text-sm text-white font-medium font-mono tracking-wide">{balance.supplierAccountNumber || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg space-y-4">
                  <div className="flex justify-between text-base">
                    <span className="text-[#9CA3AF]">Total Earned</span>
                    <span className="text-white font-semibold">€{(balance.totalGrossEarned || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base text-[#9CA3AF]">
                    <span>Cancellations</span>
                    <span className="text-white font-semibold">- €{(balance.totalCancellations || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base text-[#9CA3AF]">
                    <span>Refunds</span>
                    <span className="text-[#EF4444] font-semibold">- €{(balance.totalRefunds || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-[#9CA3AF]">Net Earned</span>
                    <span className="text-[#22C55E] font-semibold">€{(balance.totalEarnedAllTime || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base border-t border-[#2A2A2A] pt-3">
                    <span className="text-[#9CA3AF]">Total Paid Out</span>
                    <span className="text-white font-semibold">- €{(balance.totalAlreadyPaid || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base text-[#9CA3AF]">
                    <span>Last Paid Date</span>
                    <span className="text-white font-semibold">{balance.lastPaidDate ? new Date(balance.lastPaidDate).toLocaleDateString() : 'Never'}</span>
                  </div>
                  <div className="flex justify-between text-base text-[#9CA3AF]">
                    <span>Next Settlement Date</span>
                    <span className={balance.isPayable ? "text-green-400 font-bold" : "text-[#FACC15] font-bold"}>
                      {new Date(balance.nextSettlementDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-base border-t border-[#2A2A2A] pt-3">
                    <span className="text-[#9CA3AF] font-medium">9-Day Settlement</span>
                    <span className="text-white font-bold text-lg">€{(balance.availableToPayout || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base pt-3 border-t border-[#2A2A2A] font-semibold">
                    <span className="text-[#9CA3AF] font-normal">Future Unpaid Earnings (next cycles)</span>
                    <span className="text-[#FACC15]">€{Math.max(0, (balance.totalPendingBalance || 0) - (balance.availableToPayout || 0)).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-[#6B7280] pt-2">
                    * Note: Drivers have physically collected €{balance.totalCashCollected.toFixed(2)} in cash. The Admin is not responsible for paying out cash fares.
                  </p>
                </div>

                {/* Module Breakdown for GLOBAL */}
                {balance.breakdown && module === 'GLOBAL' && (
                  <div className="pt-6 border-t border-[#2A2A2A]">
                    <h4 className="text-base font-semibold text-white mb-4">Earnings Breakdown by Service</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      {/* Cab Bookings */}
                      <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg space-y-2">
                        <h5 className="text-sm font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Cab Bookings</h5>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Total Earned:</span>
                          <span className="text-white">€{(balance.breakdown.cab?.totalGrossEarned || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Cancellations:</span>
                          <span className="text-white">€{(balance.breakdown.cab?.totalCancellations || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Refunds:</span>
                          <span className="text-[#EF4444]">-€{(balance.breakdown.cab?.totalRefunds || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Net Earned:</span>
                          <span className="text-[#22C55E]">€{(balance.breakdown.cab?.totalEarnedAllTime || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Paid:</span>
                          <span className="text-white">€{(balance.breakdown.cab?.totalAlreadyPaid || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Pending (Future):</span>
                          <span className="text-white">€{(balance.breakdown.cab?.totalPendingBalance || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-[#2A2A2A] mt-2">
                          <span className="text-white">9-Day Settlement:</span>
                          <span className="font-bold text-[#FACC15]">€{(balance.breakdown.cab?.availableToPayout || 0).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Car Rentals */}
                      <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg space-y-2">
                        <h5 className="text-sm font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Car Rentals</h5>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Total Earned:</span>
                          <span className="text-white">€{(balance.breakdown.carRental?.totalGrossEarned || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Cancellations:</span>
                          <span className="text-white">€{(balance.breakdown.carRental?.totalCancellations || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Refunds:</span>
                          <span className="text-[#EF4444]">-€{(balance.breakdown.carRental?.totalRefunds || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Net Earned:</span>
                          <span className="text-[#22C55E]">€{(balance.breakdown.carRental?.totalEarnedAllTime || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Paid:</span>
                          <span className="text-white">€{(balance.breakdown.carRental?.totalAlreadyPaid || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Pending (Future):</span>
                          <span className="text-white">€{(balance.breakdown.carRental?.totalPendingBalance || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-[#2A2A2A] mt-2">
                          <span className="text-white">9-Day Settlement:</span>
                          <span className="font-bold text-[#FACC15]">€{(balance.breakdown.carRental?.availableToPayout || 0).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Bike Rentals */}
                      <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg space-y-2">
                        <h5 className="text-sm font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Bike Rentals</h5>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Total Earned:</span>
                          <span className="text-white">€{(balance.breakdown.bikeRental?.totalGrossEarned || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Cancellations:</span>
                          <span className="text-white">€{(balance.breakdown.bikeRental?.totalCancellations || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Refunds:</span>
                          <span className="text-[#EF4444]">-€{(balance.breakdown.bikeRental?.totalRefunds || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Net Earned:</span>
                          <span className="text-[#22C55E]">€{(balance.breakdown.bikeRental?.totalEarnedAllTime || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Paid:</span>
                          <span className="text-white">€{(balance.breakdown.bikeRental?.totalAlreadyPaid || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[#9CA3AF]">
                          <span>Pending (Future):</span>
                          <span className="text-white">€{(balance.breakdown.bikeRental?.totalPendingBalance || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-[#2A2A2A] mt-2">
                          <span className="text-white">9-Day Settlement:</span>
                          <span className="font-bold text-[#FACC15]">€{(balance.breakdown.bikeRental?.availableToPayout || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mt-6">
                  <div className="flex justify-between items-center">
                    <label className="text-base font-medium text-[#9CA3AF]">Payout Amount (€)</label>
                    {balance && balance.isPayable && (balance.availableToPayout || 0) > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsCustomAmount(!isCustomAmount)}
                        className="text-sm font-medium text-[#FACC15] hover:text-[#E5B800] transition-colors"
                      >
                        {isCustomAmount ? '↩ Use Default Amount' : '✏ Customize Amount'}
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    disabled={!balance || !balance.isPayable}
                    min="0.01"
                    max={balance ? balance.totalPendingBalance : undefined}
                    value={amount}
                    onChange={(e) => {
                      if (isCustomAmount) setAmount(e.target.value);
                    }}
                    readOnly={!isCustomAmount}
                    placeholder="0.00"
                    className={`w-full h-14 rounded-xl border-2 ${balance && Number(amount) > balance.totalPendingBalance
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[#2A2A2A] focus:border-[#FACC15]'
                      } bg-[#1A1A1A] px-4 text-xl font-bold text-white placeholder:text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20 ${!isCustomAmount ? 'cursor-default select-none' : 'cursor-text'
                      }`}
                  />
                  {balance && Number(amount) > balance.totalPendingBalance && (
                    <p className="text-sm font-medium text-red-400 mt-1">
                      Amount cannot exceed total pending balance (€{balance.totalPendingBalance.toFixed(2)})
                    </p>
                  )}
                  {isCustomAmount && (
                    <p className="text-sm font-medium text-[#6B7280]">
                      Max payable: €{(balance?.totalPendingBalance || 0).toFixed(2)} (all-time pending)
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 mt-6">
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="h-11 px-6 text-sm font-semibold text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A] border border-[#2A2A2A]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={
                      !amount ||
                      submitting ||
                      !balance ||
                      !balance.isPayable ||
                      Number(amount) <= 0 ||
                      Number(amount) > balance.totalPendingBalance ||
                      (isCustomAmount && Number(amount) > balance.totalPendingBalance)
                    }
                    className="h-11 px-8 text-sm font-bold bg-[#FACC15] text-black hover:bg-[#E5B800] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </span>
                    ) : !balance?.isPayable ? (
                      'Not Payable Yet'
                    ) : (
                      'Confirm Payout'
                    )}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
