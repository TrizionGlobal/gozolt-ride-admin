'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { paymentService } from '@/services/admin/payment.service';
import { useSuppliers } from '@/hooks/use-suppliers';
import type { SettledBalanceResponse } from '@/services/admin/payment.types';
import { toast } from 'sonner';

interface ProcessPayoutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  preselectedSupplierId?: string;
  module?: 'CAB' | 'RENTAL';
}

export function ProcessPayoutsModal({
  open,
  onOpenChange,
  onSuccess,
  preselectedSupplierId,
  module = 'CAB',
}: ProcessPayoutsModalProps) {
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

  const { data: supplierData, loading: loadingSuppliers } = useSuppliers({ limit: 100 }, open);
  const suppliers = supplierData?.data ?? [];

  const selectedSupplier = suppliers.find((s) => s.id === supplierId);
  const numAmount = parseFloat(amount) || 0;
  const canSubmit = supplierId && numAmount > 0 && !submitting;

  useEffect(() => {
    if (open && !receipt && !errorDetails) {
      if (preselectedSupplierId) {
        setSupplierId(preselectedSupplierId);
      } else {
        setSupplierId('');
        setAmount('');
        setBalance(null);
        setReceipt(null);
        setIsCustomAmount(false);
      }
    }
  }, [open, preselectedSupplierId, receipt, errorDetails]);

  useEffect(() => {
    if (balance && !isCustomAmount) {
      // Always reset amount back to default when toggling off customization
      setAmount(balance.availableToPayout > 0 ? balance.availableToPayout.toFixed(2) : '');
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
        setAmount(bal.availableToPayout.toString());
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
        remainingPendingAfterThis: Math.max(0, newBal.totalPendingBalance - newBal.availableToPayout),
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
      handleCancel();
    } catch (error) {
      toast.error('Failed to send notification email');
    } finally {
      setIsNotifying(false);
    }
  };

  const resetForm = () => {
    setSupplierId('');
    setAmount('');
    setBalance(null);
    setReceipt(null);
    setErrorDetails(null);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setTimeout(resetForm, 200);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) handleCancel();
      else onOpenChange(val);
    }}>
      <DialogContent aria-describedby={undefined} className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
        {receipt ? 'Payment Successful' : errorDetails ? 'Payment Failed' : 'Process 9-Day Settlement'}
          </DialogTitle>
        </DialogHeader>

        {receipt ? (
          <div className="space-y-5 py-4 flex flex-col items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border-2 border-green-500/30">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">€{receipt.amountSent.toFixed(2)}</p>
              <p className="text-sm text-[#9CA3AF] mt-1">Successfully sent to supplier</p>
            </div>
            <div className="w-full bg-[#141414] p-4 rounded-xl border border-[#2A2A2A] space-y-3 text-sm">
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
                  <span className="text-white font-mono text-xs">{receipt.supplierAccountNumber}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[#9CA3AF]">Date Paid</span>
                <span className="text-white">{receipt.datePaid}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#2A2A2A]">
                <span className="text-[#9CA3AF]">Remaining Balance</span>
                <span className="text-[#FACC15] font-bold">€{receipt.remainingPendingAfterThis.toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={handleCancel}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Done
            </Button>
          </div>
        ) : errorDetails ? (
          errorDetails === 'Supplier has not connected a Stripe account for payouts.' ? (
            <div className="space-y-4 py-4 flex flex-col items-center justify-center">
              <AlertTriangle className="h-16 w-16 text-yellow-500 mb-2" />
              <p className="text-xl font-bold text-white text-center">Missing Bank Details</p>
              <div className="w-full bg-[#141414] p-4 rounded-lg border border-[#2A2A2A] space-y-3 text-sm">
                <p className="text-[#9CA3AF] text-center">The supplier has not yet added their bank account details.</p>
                <div className="flex flex-col space-y-2 pt-3 border-t border-[#2A2A2A]">
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Supplier Name:</span>
                    <span className="text-white font-medium">{selectedSupplier?.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Email:</span>
                    <span className="text-white font-medium truncate max-w-[200px]" title={selectedSupplier?.email}>{selectedSupplier?.email}</span>
                  </div>
                </div>
              </div>
              <div className="w-full flex space-x-3 mt-4">
                <Button
                  onClick={handleCancel}
                  className="flex-1 bg-[#374151] hover:bg-[#4B5563] text-white"
                >
                  Close
                </Button>
                <Button
                  onClick={handleNotifySupplier}
                  disabled={isNotifying}
                  className="flex-1 bg-[#FACC15] hover:bg-[#FACC15]/90 text-black font-semibold"
                >
                  {isNotifying ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Notifying...</>
                  ) : (
                    'Notify Supplier'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 py-4 flex flex-col items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border-2 border-red-500/30">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">Payout Failed</p>
                <p className="text-xs text-[#9CA3AF] mt-1">The payment could not be processed</p>
              </div>
              <div className="w-full bg-[#141414] p-4 rounded-xl border border-[#2A2A2A] space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Supplier</span>
                  <span className="text-white font-medium">{selectedSupplier?.companyName}</span>
                </div>
                <div className="pt-2 border-t border-[#2A2A2A]">
                  <span className="text-[#9CA3AF] block mb-1">Reason</span>
                  <span className="text-red-400">{errorDetails}</span>
                </div>
              </div>
              <Button
                onClick={handleCancel}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Close
              </Button>
            </div>
          )
        ) : (
          <>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm text-[#9CA3AF]">Selected Supplier</label>
                {preselectedSupplierId ? (
                  <div className="w-full h-10 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 flex items-center text-sm text-white">
                    {selectedSupplier?.companyName || 'Loading...'}
                  </div>
                ) : (
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full h-10 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20 appearance-none"
                  >
                    <option value="" className="bg-[#141414]">
                      {loadingSuppliers ? 'Loading...' : 'Select supplier...'}
                    </option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#141414]">
                        {s.companyName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedSupplier && (
                <div className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md space-y-2">
                  <div className="flex flex-col space-y-0.5 pt-2 border-[#2A2A2A]">
                    <span className="text-sm font-semibold text-white">{selectedSupplier.companyName}</span>
                    <span className="text-xs text-[#9CA3AF]">{selectedSupplier.email}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#9CA3AF]">Phone</span>
                    <span className="text-white">{selectedSupplier.contactPhone || 'N/A'}</span>
                  </div>
                </div>
              )}

              {loadingBalance ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-[#FACC15]" />
                  <span className="ml-2 text-sm text-[#9CA3AF]">Calculating 9-day settlement...</span>
                </div>
              ) : balance ? (
                <div className="p-4 bg-[#141414] border border-[#2A2A2A] rounded-md space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9CA3AF]">Total Earned</span>
                    <span className="text-white">€{(balance.totalEarnedAllTime || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#9CA3AF]">
                    <span>User Cancellation Fees</span>
                    <span className="text-white">€{(balance.totalPenaltyEarned || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9CA3AF]">Total Paid Out</span>
                    <span className="text-white">- €{(balance.totalAlreadyPaid || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#9CA3AF]">
                    <span>Last Paid Date</span>
                    <span className="text-white">{balance.lastPaidDate ? new Date(balance.lastPaidDate).toLocaleDateString() : 'Never'}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#9CA3AF]">
                    <span>Next Settlement Date</span>
                    <span className={balance.isPayable ? "text-green-400 font-medium" : "text-[#FACC15]"}>
                      {new Date(balance.nextSettlementDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-[#2A2A2A] pt-2">
                    <span className="text-[#9CA3AF]">9-Day Settlement</span>
                    <span className="text-white">€{balance.availableToPayout.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-[#2A2A2A] font-semibold">
                    <span className="text-[#9CA3AF] font-normal text-xs">Future Unpaid Earnings (next cycles)</span>
                    <span className="text-[#FACC15]">€{Math.max(0, balance.totalPendingBalance - balance.availableToPayout).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    * Note: Drivers have physically collected €{balance.totalCashCollected.toFixed(2)} in cash. The Admin is not responsible for paying out cash fares.
                  </p>
                </div>
              ) : null}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-[#9CA3AF]">Payout Amount (€)</label>
                  {balance && balance.isPayable && balance.availableToPayout > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsCustomAmount(!isCustomAmount)}
                      className="text-xs text-[#FACC15] hover:text-[#E5B800] transition-colors"
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
                  className={`w-full h-10 rounded-md border ${
                    balance && Number(amount) > balance.totalPendingBalance
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[#2A2A2A] focus:border-[#FACC15]'
                  } bg-[#141414] px-3 text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20 ${
                    !isCustomAmount ? 'cursor-default select-none' : 'cursor-text'
                  }`}
                />
                {balance && Number(amount) > balance.totalPendingBalance && (
                  <p className="text-xs text-red-400 mt-1">
                    Amount cannot exceed total pending balance (€{balance.totalPendingBalance.toFixed(2)})
                  </p>
                )}
                {isCustomAmount && (
                  <p className="text-xs text-[#6B7280]">
                    Max payable: €{(balance?.totalPendingBalance || 0).toFixed(2)} (all-time pending)
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A]"
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
                className="bg-[#FACC15] text-black hover:bg-[#E5B800] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : !balance?.isPayable ? (
                  'Not Payable Yet'
                ) : (
                  'Confirm Payout'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
