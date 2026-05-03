'use client';

import {
  MapPin,
  CreditCard,
  Flame,
  Phone,
  Mail,
  Bug,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Integration, IntegrationStatus } from '@/services/admin/settings.types';
import { toast } from 'sonner';

const ICON_MAP: Record<string, React.ElementType> = {
  MapPin,
  CreditCard,
  Flame,
  Phone,
  Mail,
  Bug,
};

const STATUS_STYLES: Record<IntegrationStatus, { bg: string; text: string; label: string }> = {
  connected: { bg: 'bg-[#22C55E]/10', text: 'text-[#22C55E]', label: 'Connected' },
  error: { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', label: 'Error' },
  disconnected: { bg: 'bg-[#6B7280]/10', text: 'text-[#9CA3AF]', label: 'Disconnected' },
};

interface IntegrationCardProps {
  integration: Integration;
  testing: boolean;
  onTest: (id: string) => Promise<boolean>;
}

export function IntegrationCard({ integration, testing, onTest }: IntegrationCardProps) {
  const Icon = ICON_MAP[integration.icon] ?? MapPin;
  const status = STATUS_STYLES[integration.status];

  const handleTest = async () => {
    const success = await onTest(integration.id);
    if (success) {
      toast.success(`${integration.name} connection test passed`);
    } else {
      toast.error(`${integration.name} connection test failed`);
    }
  };

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
            <Icon className="h-5 w-5 text-[#9CA3AF]" />
          </div>
          <h4 className="text-sm font-medium text-white">{integration.name}</h4>
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleTest}
          disabled={testing}
          className="h-8 text-xs text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] flex-1"
        >
          {testing ? 'Testing...' : 'Test Connection'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toast.info('Integration configuration coming soon')}
          className="h-8 text-xs text-[#FACC15] hover:text-[#E5B800] hover:bg-[#1A1A1A] flex-1"
        >
          Configure
        </Button>
      </div>
    </div>
  );
}
