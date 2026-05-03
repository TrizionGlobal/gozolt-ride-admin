'use client';

import {
  AlertTriangle,
  Euro,
  FileText,
  Wrench,
  Bell,
  Volume2,
} from 'lucide-react';
import { getCampaignIconConfig } from '@/services/admin/notification.types';

const ICON_MAP: Record<string, React.ElementType> = {
  AlertTriangle,
  Euro,
  FileText,
  Wrench,
  Bell,
  Volume2,
};

interface CampaignIconProps {
  title: string;
}

export function CampaignIcon({ title }: CampaignIconProps) {
  const config = getCampaignIconConfig(title);
  const Icon = ICON_MAP[config.icon] ?? Bell;

  return (
    <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
      <Icon className="h-4 w-4" />
    </div>
  );
}
