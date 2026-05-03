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
import {
  CHANNEL_OPTIONS,
  AUDIENCE_OPTIONS,
  type NotificationChannel,
  type CampaignAudience,
  type CreateCampaignPayload,
  type NotificationCampaign,
} from '@/services/admin/notification.types';
import { toast } from 'sonner';

interface ComposeNotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: CreateCampaignPayload) => Promise<NotificationCampaign>;
}

const inputClass =
  'w-full h-10 rounded-md border border-[#2A2A2A] bg-[#141414] px-3 text-sm text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/20';

const labelClass = 'text-sm text-[#9CA3AF]';

export function ComposeNotificationModal({
  open,
  onOpenChange,
  onCreate,
}: ComposeNotificationModalProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [audience, setAudience] = useState<CampaignAudience>('ALL_DRIVERS');
  const [scheduledAt, setScheduledAt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = title.trim() && body.trim() && channels.length > 0 && !submitting;
  const isScheduled = !!scheduledAt;

  const toggleChannel = (ch: NotificationChannel) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch],
    );
  };

  const resetForm = () => {
    setTitle('');
    setBody('');
    setChannels([]);
    setAudience('ALL_DRIVERS');
    setScheduledAt('');
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);

    try {
      const payload: CreateCampaignPayload = {
        title: title.trim(),
        body: body.trim(),
        type: 'GENERAL',
        channels,
        targetAudience: audience,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      };

      await onCreate(payload);
      toast.success(isScheduled ? 'Notification scheduled' : 'Notification sent');
      onOpenChange(false);
      resetForm();
    } catch {
      toast.error('Failed to create notification');
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
            Compose Notification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-2">
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Surge pricing active in Valletta"
              className={inputClass}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className={labelClass}>Message *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Notification message..."
              rows={3}
              className={`${inputClass} h-auto py-2 resize-none`}
            />
          </div>

          {/* Channels */}
          <div className="space-y-2">
            <label className={labelClass}>Channels *</label>
            <div className="flex gap-2">
              {CHANNEL_OPTIONS.map((opt) => {
                const selected = channels.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleChannel(opt.value)}
                    className={`flex-1 h-10 rounded-md text-sm font-medium transition-colors ${
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

          {/* Target Audience */}
          <div className="space-y-2">
            <label className={labelClass}>Target Audience *</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as CampaignAudience)}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              {AUDIENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#141414] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <label className={labelClass}>Schedule (optional)</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className={inputClass}
            />
            <p className="text-xs text-[#6B7280]">
              {isScheduled
                ? 'Campaign will be sent at the scheduled time'
                : 'Leave empty to send immediately'}
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
                {isScheduled ? 'Scheduling...' : 'Sending...'}
              </span>
            ) : isScheduled ? (
              'Schedule'
            ) : (
              'Send Now'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
