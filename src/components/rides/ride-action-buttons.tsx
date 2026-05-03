'use client';

import { DollarSign, AlertTriangle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RideActionButtonsProps {
  onIssueRefund: () => void;
  onFlagDispute: () => void;
}

export function RideActionButtons({ onIssueRefund, onFlagDispute }: RideActionButtonsProps) {
  return (
    <div className="flex items-center gap-2 pt-3 border-t border-[#2A2A2A]">
      <Button
        onClick={onIssueRefund}
        className="bg-green-600 text-white hover:bg-green-700"
      >
        <DollarSign className="mr-1.5 h-4 w-4" />
        Issue Refund
      </Button>
      <Button
        onClick={onFlagDispute}
        className="bg-red-600 text-white hover:bg-red-700"
      >
        <AlertTriangle className="mr-1.5 h-4 w-4" />
        Flag Dispute
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('Chat view — coming soon')}
        className="border-[#2A2A2A] bg-transparent text-white hover:bg-[#1A1A1A] hover:text-white"
      >
        <MessageSquare className="mr-1.5 h-4 w-4" />
        View Chat
      </Button>
    </div>
  );
}
