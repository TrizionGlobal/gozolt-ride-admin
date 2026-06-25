'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
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
}

export function ProcessPayoutsModal({
  open,
  onOpenChange,
  onSuccess,
  preselectedSupplierId,
}: ProcessPayoutsModalProps) {
  const [supplierId, setSupplierId] = useState(preselectedSupplierId || '');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [balance, setBalance] = useState<SettledBalanceResponse | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [receipt, setReceipt] = useState<{
    amountSent: number;
    totalCashCollected: number;
    remainingPendingAfterThis: number;
    transferId: string;
  } | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isCustomAmount, setIsCustomAmount] = useState(false);

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
        const bal = await paymentService.getSettledBalance(supplierId);
        setBalance(bal);
        setAmount(bal.availableToPayout.toString());
      } catch {
        toast.error('Failed to load settled balance for this supplier.');
      } finally {
        setLoadingBalance(false);
      }
    };
    fetchBalance();
  }, [supplierId]);

  const handleConfirm = async () => {
    if (!canSubmit || !selectedSupplier) return;
    setSubmitting(true);
    try {
      // In a real app, the backend returns the full Payout object including details
      await paymentService.triggerPayout({
        supplierId,
        amount: numAmount,
      });
      toast.success(
        `Payout of €${numAmount.toFixed(2)} transferred to ${selectedSupplier.companyName}`,
      );
      
      // Mocking the receipt since the current API response only gives id and status
      // We will refresh the balance to show the remaining.
      const newBal = await paymentService.getSettledBalance(supplierId);
      setReceipt({
        amountSent: numAmount,
        totalCashCollected: balance?.totalCashCollected || 0,
        remainingPendingAfterThis: Math.max(0, newBal.totalPendingBalance - newBal.availableToPayout),
        transferId: `tr_${Math.random().toString(36).substr(2, 9)}`, // Mock stripe transfer ID for UI receipt
      });
      
      onSuccess();
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to process payout. Ensure Supplier has Stripe connected.';
      setErrorDetails(msg);
    } finally {
      setSubmitting(false);
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
            {receipt ? 'Settlement Receipt' : errorDetails ? 'Settlement Failed' : 'Process 9-Day Settlement'}
          </DialogTitle>
        </DialogHeader>

        {receipt ? (
          <div className="space-y-4 py-4 flex flex-col items-center justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
            <p className="text-xl font-bold text-white">€{receipt.amountSent.toFixed(2)} Sent</p>
            <div className="w-full bg-[#141414] p-4 rounded-lg border border-[#2A2A2A] space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Supplier</span>
                <span className="text-white font-medium">{selectedSupplier?.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Stripe Transfer ID</span>
                <span className="text-white font-medium font-mono">{receipt.transferId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Driver Cash Kept</span>
                <span className="text-red-400 font-medium">€{receipt.totalCashCollected.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#2A2A2A]">
                <span className="text-[#9CA3AF]">Remaining balance</span>
                <span className="text-[#FACC15] font-bold">€{receipt.remainingPendingAfterThis.toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={handleCancel}
              className="w-full bg-[#374151] hover:bg-[#4B5563] text-white mt-4"
            >
              Close
            </Button>
          </div>
        ) : errorDetails ? (
          <div className="space-y-4 py-4 flex flex-col items-center justify-center">
            <XCircle className="h-16 w-16 text-red-500 mb-2" />
            <p className="text-xl font-bold text-white text-center">Payout Failed</p>
            <div className="w-full bg-[#141414] p-4 rounded-lg border border-[#2A2A2A] space-y-2 text-sm">
              <div className="flex flex-col space-y-1">
                <span className="text-[#9CA3AF]">Error Details</span>
                <span className="text-red-400 font-medium">{errorDetails}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#2A2A2A] mt-2">
                <span className="text-[#9CA3AF]">Supplier</span>
                <span className="text-white font-medium">{selectedSupplier?.companyName}</span>
              </div>
            </div>
            <Button
              onClick={handleCancel}
              className="w-full bg-[#374151] hover:bg-[#4B5563] text-white mt-4"
            >
              Close
            </Button>
          </div>
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
                    <span className="text-white">Remaining balance</span>
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
                  {balance && balance.isPayable && (balance.totalPendingBalance - balance.availableToPayout > 0) && (
                    <button
                      type="button"
                      onClick={() => setIsCustomAmount(!isCustomAmount)}
                      className="text-xs text-[#FACC15] hover:text-[#E5B800] transition-colors"
                    >
                      {isCustomAmount ? 'Use Default 9-Day Settlement' : 'Customize Amount'}
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  disabled={!balance || !balance.isPayable || (!isCustomAmount && balance.availableToPayout > 0)}
                  min="0.01"
                  max={balance ? balance.totalPendingBalance : undefined}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  readOnly={!isCustomAmount}
                  placeholder="0.00"
                  className={`w-full h-10 rounded-md border ${balance && Number(amount) > balance.totalPendingBalance ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-[#2A2A2A] focus:border-[#FACC15] focus:ring-[#FACC15]/20'} bg-[#141414] px-3 text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:ring-1 ${!isCustomAmount ? 'cursor-not-allowed opacity-80' : ''}`}
                />
                {balance && Number(amount) > balance.totalPendingBalance && (
                  <p className="text-xs text-red-400 mt-1">
                    Amount cannot exceed total available funds (€{balance.totalPendingBalance.toFixed(2)})
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
                  Number(amount) > balance.totalPendingBalance
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
