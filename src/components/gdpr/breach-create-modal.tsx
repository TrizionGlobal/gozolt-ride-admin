'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type {
  BreachSeverity,
  CreateBreachPayload,
  DataBreach,
} from '@/services/admin/gdpr.types';
import { toast } from 'sonner';

interface BreachCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: CreateBreachPayload) => Promise<DataBreach>;
}

const inputClass =
  'w-full h-10 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20';

const labelClass = 'text-sm text-[#9CA3AF]';

const DATA_TYPE_OPTIONS = [
  { value: 'personal', label: 'Personal Data' },
  { value: 'financial', label: 'Financial Data' },
  { value: 'location', label: 'Location Data' },
  { value: 'identity', label: 'Identity Documents' },
];

const SEVERITY_OPTIONS: { value: BreachSeverity; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
];

export function BreachCreateModal({
  open,
  onOpenChange,
  onCreate,
}: BreachCreateModalProps) {
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<BreachSeverity>('LOW');
  const [dataTypes, setDataTypes] = useState<string[]>([]);
  const [affectedUsers, setAffectedUsers] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = description.trim() && dataTypes.length > 0 && !submitting;

  const toggleDataType = (type: string) => {
    setDataTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const resetForm = () => {
    setDescription('');
    setSeverity('LOW');
    setDataTypes([]);
    setAffectedUsers('');
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);

    try {
      const payload: CreateBreachPayload = {
        description: description.trim(),
        severity,
        dataTypes,
        affectedUsers: affectedUsers ? parseInt(affectedUsers, 10) : null,
      };

      await onCreate(payload);
      toast.success('Breach report created');
      onOpenChange(false);
      resetForm();
    } catch {
      toast.error('Failed to create breach report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Report Data Breach
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Description */}
          <div className="space-y-2">
            <label className={labelClass}>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the nature and scope of the breach..."
              rows={4}
              className={`${inputClass} h-auto py-2 resize-none`}
            />
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <label className={labelClass}>Severity *</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as BreachSeverity)}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              {SEVERITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#141414] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Data Types */}
          <div className="space-y-2">
            <label className={labelClass}>Data Types Affected *</label>
            <div className="grid grid-cols-2 gap-2">
              {DATA_TYPE_OPTIONS.map((opt) => {
                const selected = dataTypes.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleDataType(opt.value)}
                    className={`h-10 rounded-md text-sm font-medium transition-colors ${
                      selected
                        ? 'bg-[#FACC15] text-black'
                        : 'border border-[#2A2A2A] bg-[#141414] text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Affected Users */}
          <div className="space-y-2">
            <label className={labelClass}>Affected Users (optional)</label>
            <input
              type="number"
              min="0"
              value={affectedUsers}
              onChange={(e) => setAffectedUsers(e.target.value)}
              placeholder="Number of affected users"
              className={inputClass}
            />
            <p className="text-xs text-[#6B7280]">
              Leave empty if the number is unknown
            </p>
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
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-[#FACC15] text-black hover:bg-[#E5B800] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </span>
            ) : (
              'Report Breach'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
