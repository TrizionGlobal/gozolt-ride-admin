'use client';

import { useState } from 'react';
import { Send, Shield, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Dispute, DisputeReply, DisputeStatus } from '@/services/admin/dispute.types';
import { toast } from 'sonner';

interface DisputeDetailDrawerProps {
  dispute: Dispute;
  onReply: (id: string, message: string) => Promise<DisputeReply | null>;
  onStatusChange: (id: string, status: DisputeStatus) => Promise<boolean>;
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DisputeDetailDrawer({
  dispute,
  onReply,
  onStatusChange,
}: DisputeDetailDrawerProps) {
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    const result = await onReply(dispute.id, replyText.trim());
    if (result) {
      toast.success('Reply sent');
      setReplyText('');
    } else {
      toast.error('Failed to send reply');
    }
    setSending(false);
  };

  const handleResolve = async () => {
    const success = await onStatusChange(dispute.id, 'resolved');
    if (success) toast.success('Dispute marked as resolved');
    else toast.error('Failed to update status');
  };

  const handleEscalate = async () => {
    const success = await onStatusChange(dispute.id, 'escalated');
    if (success) toast.success('Dispute escalated');
    else toast.error('Failed to escalate');
  };

  return (
    <div className="border-t border-[#2A2A2A] bg-[#0A0A0A] px-4 py-4 space-y-4">
      {/* Description */}
      <div>
        <p className="text-xs font-medium text-[#6B7280] mb-1">Description</p>
        <p className="text-sm text-[#9CA3AF]">{dispute.description}</p>
      </div>

      {/* Ride info */}
      {dispute.rideId && (
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <MapPin className="h-3.5 w-3.5" />
          <span>
            Ride: {dispute.rideId.slice(0, 8)} &middot; Valletta → Sliema &middot; €
            {dispute._rideAmount.toFixed(2)}
          </span>
        </div>
      )}

      {/* Replies */}
      {dispute._replies.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#6B7280]">Replies</p>
          {dispute._replies.map((reply) => (
            <div
              key={reply.id}
              className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                {reply.authorRole === 'ADMIN' ? (
                  <Shield className="h-3.5 w-3.5 text-[#FACC15]" />
                ) : (
                  <User className="h-3.5 w-3.5 text-[#6B7280]" />
                )}
                <span className="text-xs font-medium text-white">
                  {reply.authorName}
                </span>
                <span className="text-xs text-[#6B7280]">
                  {formatDateTime(reply.createdAt)}
                </span>
              </div>
              <p className="text-sm text-[#9CA3AF]">{reply.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply input */}
      <div className="space-y-2">
        <Textarea
          placeholder="Type your reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={2}
          className="bg-[#141414] border-[#2A2A2A] text-white placeholder:text-[#6B7280] focus:border-[#FACC15] focus:ring-[#FACC15]/20 resize-none"
        />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSendReply}
            disabled={sending || !replyText.trim()}
            className="h-8 text-xs bg-[#FACC15] text-black hover:bg-[#E5B800]"
          >
            <Send className="mr-1 h-3.5 w-3.5" />
            {sending ? 'Sending...' : 'Send Reply'}
          </Button>
          {dispute._uiStatus !== 'resolved' && dispute._uiStatus !== 'closed' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResolve}
                className="h-8 text-xs text-[#22C55E] hover:text-[#22C55E] hover:bg-[#22C55E]/10"
              >
                Mark Resolved
              </Button>
              {!dispute._isEscalated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEscalate}
                  className="h-8 text-xs text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
                >
                  Escalate
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
