'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  User,
  Store,
  Euro,
  Calendar,
  MoreVertical,
  Eye,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DisputeStatusBadge } from './dispute-status-badge';
import { DisputeMetadataItem } from './dispute-metadata-item';
import { DisputeDetailDrawer } from './dispute-detail-drawer';
import type { Dispute, DisputeReply, DisputeStatus } from '@/services/admin/dispute.types';
import { toast } from 'sonner';

interface DisputeCardProps {
  dispute: Dispute;
  onStatusChange: (id: string, status: DisputeStatus) => Promise<boolean>;
  onReply: (id: string, message: string) => Promise<DisputeReply | null>;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  const secs = d.getSeconds().toString().padStart(2, '0');
  return `${day}-${month} ${hours}:${mins}:${secs}`;
}

export function DisputeCard({ dispute, onStatusChange, onReply }: DisputeCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleAssign = () => {
    toast.info('Dispute assigned to you');
  };

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] overflow-hidden transition-colors hover:border-[#3A3A3A]">
      {/* Main card content */}
      <div className="px-4 py-3">
        {/* Line 1: ID, status, subject, actions */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono font-semibold text-white">
            {dispute._displayId}
          </span>
          <DisputeStatusBadge status={dispute._uiStatus} />
          <span className="text-sm text-white">{dispute.subject}</span>

          <div className="flex-1" />

          {/* Reply count */}
          <div className="flex items-center gap-1 text-[#6B7280]">
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-xs">{dispute._replyCount}</span>
          </div>

          {/* Dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-[#6B7280] hover:text-white hover:bg-[#1A1A1A]"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#141414] border-[#2A2A2A] text-white"
            >
              <DropdownMenuItem
                onClick={() => setExpanded(true)}
                className="text-sm focus:bg-[#1A1A1A] focus:text-white"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleAssign}
                className="text-sm focus:bg-[#1A1A1A] focus:text-white"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Assign to Me
              </DropdownMenuItem>
              {!dispute._isEscalated &&
                dispute._uiStatus !== 'resolved' &&
                dispute._uiStatus !== 'closed' && (
                  <DropdownMenuItem
                    onClick={() => onStatusChange(dispute.id, 'escalated')}
                    className="text-sm text-[#EF4444] focus:bg-[#EF4444]/10 focus:text-[#EF4444]"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Escalate
                  </DropdownMenuItem>
                )}
              {dispute._uiStatus !== 'resolved' && dispute._uiStatus !== 'closed' && (
                <DropdownMenuItem
                  onClick={() => onStatusChange(dispute.id, 'resolved')}
                  className="text-sm text-[#22C55E] focus:bg-[#22C55E]/10 focus:text-[#22C55E]"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Resolve
                </DropdownMenuItem>
              )}
              {dispute._uiStatus !== 'closed' && (
                <DropdownMenuItem
                  onClick={() => onStatusChange(dispute.id, 'closed')}
                  className="text-sm text-[#6B7280] focus:bg-[#1A1A1A] focus:text-white"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Close
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Expand chevron */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[#6B7280] hover:text-white transition-colors"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Line 2: Metadata */}
        <div className="flex items-center gap-5 mt-2">
          <DisputeMetadataItem icon={User} iconColor="text-[#3B82F6]" text={dispute._userName} />
          <DisputeMetadataItem icon={Store} iconColor="text-[#F97316]" text={dispute._driverName} />
          <DisputeMetadataItem
            icon={Euro}
            iconColor="text-[#22C55E]"
            text={`€${dispute._rideAmount.toFixed(2)}`}
          />
          <DisputeMetadataItem
            icon={Calendar}
            iconColor="text-[#9CA3AF]"
            text={formatDate(dispute.createdAt)}
          />
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <DisputeDetailDrawer
          dispute={dispute}
          onReply={onReply}
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  );
}
